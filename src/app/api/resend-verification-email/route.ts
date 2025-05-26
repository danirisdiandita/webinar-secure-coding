
import jwt from "jsonwebtoken";
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { verifyEmail } from '../../../../emails/VerifyEmail'

const resend = new Resend(process.env.RESEND_KEY)

const jwt_secret = process.env.JWT_SECRET

export const POST = async (req: Request) => {
    try {
        const { email, first_name, last_name } = await req.json();
        // regenerating invitation link 
        const token = jwt.sign(
            { email: email },
            jwt_secret as string,
            { expiresIn: "12h" }
        );

        const options = {
            from: `Noreply <${process.env.RESEND_SENDER}>`,
            to: [email],
            subject: "Resend - Verify your email",
            html: await render(verifyEmail({
                username: `${first_name} ${last_name}`,
                inviteLink: process.env.AUTH_URL + "/verify-email?verification_token=" + token
            })),
        };
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