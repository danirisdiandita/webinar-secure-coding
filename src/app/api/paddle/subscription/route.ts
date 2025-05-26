// import { saveJSONLocally } from "@/utils/save_locally"
import { Subscription } from "@/app/store/subscription-store"
import { auth } from "../../../../../auth"
import { PrismaClient } from "@prisma/client"
import { SubscriptionStatus } from "@/types/subscription_status"

const prisma = new PrismaClient()

export const GET = async () => {
    const session = await auth()
    if (!session) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 })
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

    // check free trial expired date 

    const freeTrialExpiredAt: Date | null = user_?.free_trial_expired_at ? new Date(user_?.free_trial_expired_at) : null

    // subscription_?.paddle_customer_id

    if (!subscription_ && !freeTrialExpiredAt) {
        const subscription_: Subscription = {
            previously_billed_at: null,
            next_billed_at: null,
            name: null,
            description: null,
            updated_payment_method_url: null,
            cancel_url: null,
            cancelled_at: null,
            status: SubscriptionStatus.NO_ACTIVE_SUBSCRIPTION,
            free_trial_ends_at: null
        }
        return new Response(JSON.stringify({ message: "Free Trial is not active, please subscribe", data: subscription_ }), { status: 200 })
    } else if (!subscription_ && Date.now() < (freeTrialExpiredAt as Date).getTime()) {
        const subscription_: Subscription = {
            previously_billed_at: null,
            next_billed_at: null,
            name: null,
            description: null,
            updated_payment_method_url: null,
            cancel_url: null,
            cancelled_at: null,
            status: SubscriptionStatus.FREE_TRIAL_ACTIVE,
            free_trial_ends_at: freeTrialExpiredAt ? freeTrialExpiredAt.toISOString() : null
        }
        return new Response(JSON.stringify({ message: "Free Trial is still active", data: subscription_ }), { status: 200 })
    } else if (!subscription_ && Date.now() > (freeTrialExpiredAt as Date).getTime()) {
        const subscription_: Subscription = {
            previously_billed_at: null,
            next_billed_at: null,
            name: null,
            description: null,
            updated_payment_method_url: null,
            cancel_url: null,
            cancelled_at: null,
            status: SubscriptionStatus.FREE_TRIAL_EXPIRED,
            free_trial_ends_at: freeTrialExpiredAt ? freeTrialExpiredAt.toISOString() : null
        }
        return new Response(JSON.stringify({ message: "Free Trial is expired", data: subscription_ }), { status: 403 })
    }

    const res_ = await fetch(`https://${process.env.NEXT_PUBLIC_ENV === 'production' ? 'api.paddle.com' : 'sandbox-api.paddle.com'}/subscriptions?customer_id=${subscription_?.paddle_customer_id}&status=active,past_due`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.PADDLE_API_KEY}`
        }
    })

    const result = (await res_.json())?.data

    if (!result) {
        const subscription_: Subscription = {
            previously_billed_at: null,
            next_billed_at: null,
            name: null,
            description: null,
            updated_payment_method_url: null,
            cancel_url: null,
            cancelled_at: null,
            status: SubscriptionStatus.NO_ACTIVE_SUBSCRIPTION,
            free_trial_ends_at: freeTrialExpiredAt ? freeTrialExpiredAt.toISOString() : null
        }
        return new Response(JSON.stringify({ message: "ActiveSubscription not found" , data: subscription_ }), { status: 404 })
    }

    if (result.length === 0) {
        const subscription_: Subscription = {
            previously_billed_at: null,
            next_billed_at: null,
            name: null,
            description: null,
            updated_payment_method_url: null,
            cancel_url: null,
            cancelled_at: null,
            status: SubscriptionStatus.NO_ACTIVE_SUBSCRIPTION,
            free_trial_ends_at: freeTrialExpiredAt ? freeTrialExpiredAt.toISOString() : null
        }
        return new Response(JSON.stringify({ message: "ActiveSubscription not found" , data: subscription_ }), { status: 404 })
    }

    // saveJSONLocally(result, 'subscription_active.json')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())


    const output = {
        status: result[0]?.status,
        previously_billed_at: result[0]?.items[0]?.previously_billed_at,
        next_billed_at: result[0]?.next_billed_at,
        name: result[0]?.items[0]?.price?.name,
        description: result[0]?.items[0]?.price?.description,
        updated_payment_method_url: result[0]?.management_urls?.update_payment_method,
        cancel_url: result[0]?.management_urls?.cancel,
        cancelled_at: result[0]?.scheduled_change?.action === 'cancel' ? result[0]?.scheduled_change?.effective_at : null
    }

    //     curl --location 'https://sandbox-api.paddle.com/subscriptions?customer_id=ctm_01jk9b9hmrvcvwrt9wmrzxrgyn&status=active' \
    // --header 'Accept: application/json' \
    // --header 'Authorization: Bearer <Auth token>'

    if (result?.length > 0) {
        return new Response(JSON.stringify({ message: "Subscription found", data: output }), { status: 200 })
    }
    return new Response(JSON.stringify({ message: "Subscription not found" }), { status: 404 })
}