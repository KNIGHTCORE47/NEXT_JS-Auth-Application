import { ConnectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user.models'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mail.helpers'

ConnectDB()

async function POST(request: NextRequest) {
    try {

        const requestBody = await request.json()
        const { username, email, password } = requestBody
        console.log(requestBody)



        //NOTE - TODO - User Details Validation



        //NOTE - Further Checking
        const signinedUser = await User.findOne({ email })

        if (!signinedUser) return NextResponse.json({ error: `User already exists` }, { status: 400 })

        //NOTE - Password hashing
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User(
            {
                username,
                email,
                password: hashedPassword
            }
        )

        const savedUser = await newUser.save()
        console.log(savedUser);


        //NOTE - Send verification email
        await sendEmail({ email, emailType: "Verify", userId: savedUser._Id })

        return NextResponse.json({ message: "User registered successfully", success: true, savedUser }, { status: 200 })






    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export {
    POST
} 