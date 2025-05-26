import { render } from "@react-email/components";
import jwt from "jsonwebtoken";
import forgotPasswordEmail from "../../../../../emails/ForgotPasswordEmail";
import { TokenType } from "../../../../../src/types/token";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY)
const jwt_secret = process.env.JWT_SECRET

export const POST = async (req: Request) => {
    try {
        const { email } = await req.json()
        const token = jwt.sign(
            { email: email, token_type: TokenType.RESET_PASSWORD },
            jwt_secret as string,
            { expiresIn: "12h" }
        );
        // send email with reset password link
        const options = {
            from: `Noreply <${process.env.RESEND_SENDER}>`,
            to: [email],
            subject: "Reset your password",
            html: await render(forgotPasswordEmail({
                username: email,
                forgotPasswordLink: process.env.AUTH_URL
                    + "/reset-password?reset_token="
                    + token
            })),
        };

        const response = await resend.emails.send(options)
        if (response) {
            return new Response(JSON.stringify({ message: "Password reset email sent", email }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: "Error sending email", is_error: true }), { status: 500 })
        }

    } catch (error) {
        return new Response(JSON.stringify({ message: "Error sending email", error, is_error: true }), { status: 500 })
    }
}