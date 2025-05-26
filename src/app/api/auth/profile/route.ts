
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../auth";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const GET = async () => {
    const session = await auth();
    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: session?.user?.email as string
            },
            select: {
                first_name: true,
                last_name: true,
                email: true,
                image: true
            }
        });
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error getting user", error }), { status: 500 });
    }
}


export const PUT = async (req: Request) => {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    const formData = await req.formData()
    let profile_image: File | null = null;

    if (formData.get("profile_image")) {
        profile_image = formData.get("profile_image") as File;
    }

    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;

    if (profile_image instanceof File) {
        const buffer = await profile_image.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        sharp(uint8Array)
            .jpeg()
            .resize({
                width: 400,
                height: 400,
                fit: "contain",
            }).withMetadata()
            .toBuffer()
            .then(async (data) => {
                const blob = await put(uuidv4() + ".jpg", data, {
                    access: 'public',
                });

                const user_ = await prisma.user.update({
                    where: {
                        email: session.user?.email as string
                    },
                    data: {
                        first_name,
                        last_name,
                        image: blob.url,
                        updated_at: new Date()
                    }
                })

                return new Response(JSON.stringify({
                    message: "Profile updated",
                    data: {
                        first_name: user_.first_name,
                        last_name: user_.last_name,
                        image: user_.image
                    }
                }), { status: 200 });
            }).finally(() => {
                return new Response(JSON.stringify({
                    message: "Profile updated",
                }), { status: 200 });
            });
    } else {
        const user_ = await prisma.user.update({
            where: {
                email: session.user?.email as string
            },
            data: {
                first_name,
                last_name,
                updated_at: new Date(),
                image: null
            }
        })

        return new Response(JSON.stringify({
            message: "Profile updated", data: {
                first_name: user_.first_name,
                last_name: user_.last_name,
                image: user_.image
            }
        }), { status: 200 });
    }

    return new Response(JSON.stringify({
        message: "Profile updated",
    }), { status: 200 });
}

