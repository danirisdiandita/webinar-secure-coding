import { ErrorType } from "@/types/error";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET as string;

export const POST = async (req: Request) => {
    const { email, password, first_name, last_name } = await req.json()

    // check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (existingUser) {
        return new Response(JSON.stringify({ message: "User already exists", error: true, type: ErrorType.USER_EXISTS }), { status: 400 })
    }

    const saltRounds = 10;
    // hash password
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // create user
        const res_ = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                first_name,
                last_name,
                created_at: new Date(),
                updated_at: new Date()
            }
        })
        // generate jwt token 

        const token = jwt.sign({ email: email }, jwt_secret, {
            expiresIn: "12h"
        });

        return new Response(JSON.stringify({
            email,
            first_name,
            last_name,
            created_at: res_.created_at,
            updated_at: res_.updated_at,
            verification_token: token
        }), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({
            message: "Error while inserting new user",
            is_error: true,
            error,
            type: ErrorType.UNKNOWN_ERROR
        }), { status: 500 })
    }


}

