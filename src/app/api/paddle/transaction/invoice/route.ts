// import { saveJSONLocally } from "@/utils/save_locally";
import { auth } from "../../../../../../auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const GET = async (request: Request) => {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

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

    if (!subscription_?.paddle_customer_id) {
        return new Response(JSON.stringify({ message: "Subscription not found" }), { status: 404 });
    }
    const url = new URL(request.url);
    const transactionId = url.searchParams.get("transaction_id");
    const res_ = await fetch(process.env.NEXT_PUBLIC_ENV === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com' + `/transactions/${transactionId}/invoice`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.PADDLE_API_KEY}`
        }
    })
    if (!res_.ok) {
        return new Response(JSON.stringify({ message: "Failed to get invoice", is_error: true }), {
            status: 500,
        });
    }
    const resJson = await res_.json()
    // saveJSONLocally(resJson, 'invoice.json')
    return new Response(JSON.stringify({ message: "Invoice downloaded successfully", data: resJson }), {
        status: 200,
    });
}