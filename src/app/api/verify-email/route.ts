
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const POST = async (req: Request) => {
    const { verification_token } = await req.json();

    if (!verification_token) {
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 400 });
    }

    try {
        const decoded = jwt.verify(verification_token, process.env.JWT_SECRET as string) as JwtPayload;
        // decoded.email

        await prisma.user.update({
            where: {
                email: decoded.email
            },
            data: {
                verified: true
            }
        })

        return new Response(JSON.stringify({ message: "Email verified" }), { status: 200 });

    } catch (error) {
        console.log("error", error)
        return new Response(JSON.stringify({ message: "Invalid token" }), { status: 400 });
    }
};