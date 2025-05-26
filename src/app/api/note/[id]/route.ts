import { prisma } from "@/lib/prisma"
import { auth } from "../../../../../auth"

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const session = await auth()

    if (!session?.user?.email) {
        return new Response(JSON.stringify({ message: "Forbidden, not authenticated" }), { status: 403 })
    }

    const user_ = await prisma.user.findFirst({
        where: {
            email: session?.user?.email as string
        }
    })

    if (!user_) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 })
    }

    const note_ = await prisma.note.findFirst({
        where: {
            id: Number(id),
            user_id: user_.id
        },
        select: {
            id: true,
            title: true,
            description: true,
            created_at: true,
            updated_at: true,
        }
    })

    if (!note_) {
        return new Response(JSON.stringify({ message: "Note not found" }), { status: 404 })
    }

    return new Response(JSON.stringify(note_))
}