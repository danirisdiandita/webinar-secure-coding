import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const GET = async (request: Request) => {

    const authHeader = request.headers.get('Authorization')
    const apiKey = authHeader?.split(' ').pop()

    const res = await fetch(process.env.NEXT_PUBLIC_ENV === 'production' ? 'https://api.paddle.com/prices' : 'https://sandbox-api.paddle.com' + "/prices", {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${apiKey}`
        }
    })

    if (!res.ok) {
        return new Response(JSON.stringify({ message: "Failed to get prices", is_error: true }), {
            status: 500,
        });
    }
    const prices = await res.json()


    const plans = []

    for (let i = 0; i < prices.data.length; i++) {
        plans.push(
            prisma.plan.create({
                data: {
                    name: prices.data[i].name,
                    description: prices.data[i].description,
                    paddle_pricing_id: prices.data[i].id,
                    created_at: new Date(prices.data[i].created_at),
                    updated_at: new Date(prices.data[i].updated_at)
                }
            })
        )
    }


    const plans_ = await prisma.$transaction(plans)

    return new Response(JSON.stringify({ data: plans_ }), {
        status: 200,
    });
}


// curl --location 'https://sandbox-api.paddle.com/prices' \
// --header 'Accept: application/json' \
// --header 'Authorization: Bearer 88a9773edb73af30edcd57a9486fa7752a4d6a84894a1403ee'