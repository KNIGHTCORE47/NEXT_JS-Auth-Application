import User from '@/models/user.models';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'

// Define the type for our transporter
type SentMessageInfo = nodemailer.SentMessageInfo;


async function sendEmail({ email, emailType, userId }: any): Promise<SentMessageInfo> {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        //NOTE - Configure mail for usage!!
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            )
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            )
        }

        const transport = nodemailer.createTransport({
            transport: 'smtp',
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || "570"),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        } as nodemailer.TransportOptions);

        const mailOptions = {
            from: 'abc@abc.com', // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            html: `
    <p>
        Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a> to ${emailType = "VERIFY" ? "verify your email" : "reset your password"} or copy and paste the link below in your browser.
        <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
    </p>

    <p>or</p>

    <p>
        Click <a href="${process.env.DOMAIN}/forgotpassword?token=${hashedToken}">Here</a> to ${emailType = "RESET" ? "reset your password" : "verify your email"} or copy and paste the link below in your browser.
        <br> ${process.env.DOMAIN}/forgotpassword?token=${hashedToken}
    </p>
    `, // html body
        }

        const mailResponse = await transport.sendMail(mailOptions)

        return mailResponse


    } catch (error) {
        console.error('Error creating Nodemailer transporter:', error);
        throw new Error(`Failed to create Nodemailer transporter: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export {
    sendEmail
}