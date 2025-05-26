// import * as fs from "fs"
import { auth } from "../../../../auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const upsertSubscription = async (user_id: number, paddle_customer_id: string, updated_at?: Date) => {
    return await prisma.$queryRaw`
    INSERT INTO public.subscription (user_id, paddle_customer_id, updated_at) 
    VALUES (${user_id}, ${paddle_customer_id}, ${updated_at || new Date()})
    ON CONFLICT (user_id) DO UPDATE 
    SET paddle_customer_id = excluded.paddle_customer_id,
        updated_at = excluded.updated_at;
    `
}

export const POST = async (req: Request) => {
    const session = await auth()
    const result = await req.json()

    // const paddleFolder = "./public/paddle"
    // if (!fs.existsSync(paddleFolder)) {
    //     fs.mkdirSync(paddleFolder, { recursive: true })
    // }
    // fs.writeFileSync(`${paddleFolder}/${result?.event_type}.json`, JSON.stringify(result, null, 2))
    const user_ = await prisma.user.findFirst({
        where: {
            email: session?.user?.email as string
        }
    })

    switch (result?.event_type) {
        case "customer.updated":
            if (result?.data?.id && result?.data?.email === session?.user?.email) {
                // save to database 
                const subscription_ = await upsertSubscription(user_?.id as number, result?.data?.id, result?.data?.updated_at)
                return new Response(JSON.stringify({ message: "Customer updated", data: { result, subscription: subscription_ }, paddle_status: result?.event_type }), { status: 200 })
            }
            return new Response(JSON.stringify({ message: "Customer updated", data: { result, subscription: null }, paddle_status: result?.event_type }), { status: 200 })
            break;
        case "customer.created":
            if (result?.data?.id && result?.data?.email === session?.user?.email) {
                const subscription_ = await upsertSubscription(user_?.id as number, result?.data?.id)
                return new Response(JSON.stringify({ message: "Customer created", data: { result, subscription: subscription_ }, paddle_status: result?.event_type }), { status: 200 })
            }
            return new Response(JSON.stringify({ message: "Customer created", data: { result, subscription: null }, paddle_status: result?.event_type }), { status: 200 })
            break;
        case "address.created":
            break;
        case "transaction.created":
            break;
        case "transaction.updated":
            break;
        case "transaction.ready":
            break;
        case "transaction.paid":
            break;
        case "transaction.completed":
            break;
        case "subscription.created":
            if (result?.data?.customer_id && result?.data?.email === session?.user?.email) {
                const subscription_ = await upsertSubscription(user_?.id as number, result?.data?.customer_id)
                return new Response(JSON.stringify({ message: "Subscription created", data: { result, subscription: subscription_ }, paddle_status: result?.event_type }), { status: 200 })
            }
            return new Response(JSON.stringify({ message: "Subscription created", data: { result, subscription: null }, paddle_status: result?.event_type }), { status: 200 })
            break;
        case "subscription.activated":
            if (result?.data?.customer_id && result?.data?.email === session?.user?.email) {
                const subscription_ = await upsertSubscription(user_?.id as number, result?.data?.customer_id)
                return new Response(JSON.stringify({ message: "Subscription activated", data: { result, subscription: subscription_ }, paddle_status: result?.event_type }), { status: 200 })
            }
            return new Response(JSON.stringify({ message: "Subscription activated", data: { result, subscription: null }, paddle_status: result?.event_type }), { status: 200 })
            break;
        case "subscription.updated":
            if (result?.data?.customer_id && result?.data?.email === session?.user?.email) {
                const subscription_ = await upsertSubscription(user_?.id as number, result?.data?.customer_id)
                return new Response(JSON.stringify({ message: "Subscription updated", data: { result, subscription: subscription_ }, paddle_status: result?.event_type }), { status: 200 })
            }
            return new Response(JSON.stringify({ message: "Subscription updated", data: { result, subscription: null }, paddle_status: result?.event_type }), { status: 200 })
            break;
        case "payment_method.saved":
            break;
        case "payment_method.deleted":
            break;
        default:
            break;
    }

    return new Response(JSON.stringify({ message: "No Subscription Updated", data: result }), { status: 200 })
}


// transaction.created
// address.created
// transaction.updated
// transaction.ready
// transaction.paid
// subscription.created
// subscription.activated
// transaction.updated
// transaction.updated
// transaction.completed
// payment_method.deleted
// payment_method.saved