import { render } from '@react-email/components';
import { verifyEmail } from '../../../../emails/VerifyEmail'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY)

export const POST = async (req: Request) => {
    try {
        const res = await req.json(); 
        const { email, first_name, last_name, inviteLink } = res
        const options = {
            from: `Noreply <${process.env.RESEND_SENDER}>`,
            to: [email],
            subject: "Verify your email",
            html: await render(verifyEmail({ username: `${first_name} ${last_name}`, inviteLink })),
        }
        const response = await resend.emails.send(options)
        if (response) {
            return new Response(JSON.stringify({ message: "Email sent", is_error: false }), { status: 200 })
        } else {
            return new Response(JSON.stringify({ message: "Error sending email", is_error: true }), { status: 500 })
        }

    } catch (error) {
        return new Response(JSON.stringify({ message: "Error sending email", error, is_error: true }), { status: 500 })
    }

}