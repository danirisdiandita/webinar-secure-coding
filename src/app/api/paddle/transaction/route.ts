import { Transaction, TransactionPagination } from "@/store/subscription-store";
import { auth } from "../../../../../auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const GET = async (request: Request) => {
    const url = new URL(request.url);
    const after = url.searchParams.get("after");
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    const user_ = await prisma.user.findFirst({
        where: {
            email: session?.user?.email as string
        }
    })


    if (!user_) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const subscriptions_ = await prisma.subscription.findFirst({
        where: {
            user_id: user_?.id
        }
    })

    if (!subscriptions_?.paddle_customer_id) {
        return new Response(JSON.stringify({ message: "Subscriptions not found" }), { status: 404 });
    }

    const url_ = after ? `https://${process.env.NEXT_PUBLIC_ENV === 'production' ? 'api.paddle.com' : 'sandbox-api.paddle.com'}/transactions?customer_id=${subscriptions_?.paddle_customer_id}&per_page=5&after=${after}` : `https://${process.env.NEXT_PUBLIC_ENV === 'production' ? 'api.paddle.com' : 'sandbox-api.paddle.com'}/transactions?customer_id=${subscriptions_?.paddle_customer_id}&per_page=5`

    const res = await fetch(url_, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.PADDLE_API_KEY}`
        }
    })

    const data = await res.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transactions_: Transaction[] = data?.data?.map((transaction: any) => ({
        planName: transaction?.items[0]?.price?.name,
        price: transaction?.items[0]?.price?.unit_price?.amount,
        purchaseDate: transaction?.billing_period?.starts_at ? transaction?.billing_period?.starts_at : null,
        endDate: transaction?.billing_period?.ends_at ? transaction?.billing_period?.ends_at : null,
        status: transaction?.status,
        transactionId: transaction?.id,
    }))

    const pagination_: TransactionPagination = {
        next: data?.meta?.pagination?.next,
        previous: null,
        hasNext: data?.meta?.pagination?.has_more,
        hasPrevious: false,
    }
    return new Response(JSON.stringify({ message: "Transactions found", data: { transactions: transactions_, pagination: pagination_ } }), { status: 200 });
}