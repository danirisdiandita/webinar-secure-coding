import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../auth";

const prisma = new PrismaClient();


export const GET = async () => {
    const session = await auth()
    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email as string
        },
        select: {
            username: true,
            first_name: true,
            last_name: true, 
            image: true
        }
    });
    return new Response(JSON.stringify({ message: "Session created", user }), { status: 200 });
}