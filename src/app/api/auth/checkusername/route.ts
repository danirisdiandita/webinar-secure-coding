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
            first_name: true,
            last_name: true, 
        }
    });
    return new Response(JSON.stringify({ message: "Session created", user }), { status: 200 });
}