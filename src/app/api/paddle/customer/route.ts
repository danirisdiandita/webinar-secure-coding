import { auth } from "../../../../../auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async () => {
    const session = await auth()
    const user_ = await prisma.user.findFirst({
        where: {
            email: session?.user?.email as string
        }
    })
    const subscription_ = await prisma.subscription.findFirst({
        where: {
            user_id: user_?.id
        }
    })

    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })
    }
    return new Response(JSON.stringify({ message: "Subscription found", data: subscription_ }), { status: 200 })
}