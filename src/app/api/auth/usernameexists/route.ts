import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (req: Request) => {
    const { username } = await req.json()
    const user = await prisma.user.findFirst({
        where: {
            username: username
        }
    })

    return new Response(JSON.stringify({ exists: !!user }), { status: 200 })
}