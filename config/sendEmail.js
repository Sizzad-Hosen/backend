import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'E-commerce <onboarding@resend.dev>',

            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("❌ Email sending error:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("❌ Server error:", error);
    }
};

export default sendEmail;
