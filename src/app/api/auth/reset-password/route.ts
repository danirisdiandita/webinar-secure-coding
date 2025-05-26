import { TokenType } from "@/types/token";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {

    try {
        const { new_password, reset_token } = await req.json();

        const jwt_secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(reset_token, jwt_secret) as JwtPayload;

        // decoded is in the form { email: 'email', token_type: 'reset-password' }
        const { email, token_type } = decoded;

        if (token_type !== TokenType.RESET_PASSWORD) {
            return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400 });
        }

        // update password

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hashedPassword,
                updated_at: new Date()
            }
        });

        return new Response(JSON.stringify({ message: "Password has been reset successfully" }), { status: 200 });
    } catch (error) {
        // console.log("error", error)
        return new Response(JSON.stringify({ message: "Invalid request", error }), { status: 400 });
    }
};