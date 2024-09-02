import User from '@/models/user';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs'


export async function sendEmail({ email, emailType, userId }: any) {
    if (!email || !emailType || !userId) {
        throw new Error('Missing required parameters for sending email');
    }

    console.log('Email:', email);
    console.log('Email Type:', emailType);
    console.log('Type of Email Type:', typeof emailType);
    console.log('User ID:', userId);

    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        //NOTE - Configure mail for usage!!
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        verifyToken: hashedToken,
                        verifyTokenExpiry: Date.now() + 3600000
                    }
                }
            )
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        forgotPasswordToken: hashedToken,
                        forgotPasswordTokenExpiry: Date.now() + 3600000
                    }
                }
            )
        }

        const transport = nodemailer.createTransport({
            host: String(process.env.SMTP_HOST),
            port: Number(process.env.SMTP_PORT || "465"),
            auth: {
                user: String(process.env.SMTP_USER),
                pass: String(process.env.SMTP_PASS),
            },
        });

        const htmlBodyForVerifyEmail = `
    <p>
            Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"} 
            or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
    `

        const htmlBodyForForgotPassword = `
    <p>
            Click <a href="${process.env.DOMAIN}/forgotpassword?token=${hashedToken}">here</a> to ${emailType === "RESET" ? "Reset your password" : "Verify your email"} 
            or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>
    `

        const mailOptions = {
            from: 'abc@abc.com', // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            html: emailType === "VERIFY" ? htmlBodyForVerifyEmail : htmlBodyForForgotPassword, // html body
        }

        const mailResponse = await transport.sendMail(mailOptions)
        console.log("Email sent successfully:", mailResponse);
        return mailResponse


    } catch (error: any) {
        console.error('Error sending email:', error);
        console.error('Error details:', error.response);
        throw new Error(error.message);
    }
}