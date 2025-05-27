import { prisma } from "@/lib/prisma"
import { auth } from "../../../../../auth"
// import { z } from "zod"


export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;


    // TO DO 3 - FIXING VALIDATION
    // const idSchema = z.string().refine(val => !isNaN(Number(val)), {
    //     message: "ID must be a valid number string"
    // });

    // try {
    //     idSchema.parse(id);
    // } catch (error) {
    //     return new Response(JSON.stringify({ message: "Invalid ID format", error }), { status: 400 });
    // }

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


    // TODO 1 - FIXING SQL INJECTION
    // Unsafe Query
    const noteUnsafe: [{
        id: number;
        title: string;
        description: string;
        content: string;
        created_at: Date;
        updated_at: Date;
    }] = await prisma.$queryRawUnsafe(`select 
        id, title, description, content, created_at, updated_at 
        from public.note where id = ${id} and user_id = ${user_.id}`)

    if (!noteUnsafe) {
        return new Response(JSON.stringify({ message: "Note not found" }), { status: 404 })
    }

    // TODO 2 - FIXING BROKEN ACCESS CONTROL 

    // const note_ = await prisma.note.findFirst({
    //     where: {
    //         id: Number(id)
    //     },
    //     select: {
    //         id: true,
    //         title: true,
    //         description: true,
    //         content: true,
    //         created_at: true,
    //         updated_at: true,
    //     }
    // })

    // if (!note_) {
    //     return new Response(JSON.stringify({ message: "Note not found" }), { status: 404 })
    // }

    return new Response(JSON.stringify({ message: "Note fetched successfully", data: noteUnsafe[0] }))
}


export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
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
            id: Number(id)
        },
        select: {
            id: true,
            title: true,
            description: true,
            content: true,
            created_at: true,
            updated_at: true,
        }
    })

    if (!note_) {
        return new Response(JSON.stringify({ message: "Note not found" }), { status: 404 })
    }

    return new Response(JSON.stringify(note_))
}