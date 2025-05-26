import NextAuth, { AuthError } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"


export class InvalidLoginError extends AuthError {
    my_massage_biach = ''
    constructor(message: string) {
        super(message)
        this.my_massage_biach = message
    }
}

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email as string
                    }
                })

                if (!existingUser) {
                    // throw new Error("Email not found")
                    throw new InvalidLoginError("Email not found")
                }

                const res_bcrypt = await bcrypt.compare(credentials?.password as string, existingUser?.password as string)

                if (!res_bcrypt) {
                    // throw new Error("Invalid Password!")
                    throw new InvalidLoginError("Invalid Password!")
                }

                const user = {
                    name: existingUser?.first_name + " " + existingUser?.last_name,
                    email: existingUser?.email,
                    image: existingUser?.image,
                    expires: new Date(Date.now() + 12 * 60 * 60 * 1000)
                }
                return user
            },
        }),
    ],

    pages: {
        signIn: "/sign-in"
    },

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log("user", user)
            // console.log("account", account)
            // console.log("profile", profile)
            // console.log("email", email)
            // console.log("credentials", credentials)

            if (account?.provider === "google") {
                const isVerified = profile?.email_verified ? true : false
                // insert to database if user is not exists or else insert 

                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: profile?.email as string
                    }
                })


                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: profile?.email as string,
                            first_name: profile?.given_name,
                            last_name: profile?.family_name,
                            created_at: new Date(),
                            updated_at: new Date(),
                            verified: isVerified
                        }
                    })
                }
                return isVerified
            } else if (account?.provider === "credentials") {
                if (user) {
                    return true
                } else {
                    // throw new Error("User not found")
                    return false
                }
            } else {
                return false
            }
        },

        // async redirect({ url, baseUrl }) {
        //     return url
        // }

        async redirect({ url }) {
            return url
        }
    },
    jwt: {
        maxAge: 24 * 60 * 60
    },
    session: {
        maxAge: 24 * 60 * 60,
        strategy: "jwt"
    }
})