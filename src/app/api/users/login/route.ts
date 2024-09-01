import { ConnectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import JWT from 'jsonwebtoken'

ConnectDB()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody;
        console.log(reqBody);

        if (!email || !password) return NextResponse.json({ error: "email or password is required" }, { status: 400 })

        const loggedInUser = await User.findOne({ email })

        if (!loggedInUser) return NextResponse.json({ error: "User does not exists" }, { status: 400 })

        console.log("user exists", loggedInUser);

        //NOTE - Checking user login credentials
        const validatePassword = await bcryptjs.compare(password, loggedInUser.password)    //Time consuming and return boolean value "true" or "false"

        if (!validatePassword) return NextResponse.json({ error: "Check your credentials" }, { status: 400 })


        //NOTE - JWT token creation
        const tokenDataOrPayload = {
            id: loggedInUser._id,
            username: loggedInUser.username,
            email: loggedInUser.email
        }

        const token = JWT.sign(tokenDataOrPayload, String(process.env.TOKEN_SECRET!), { expiresIn: '1d' })

        const response = NextResponse.json({
            message: "Logged In Success",
            success: true
        }, { status: 200 })


        //NOTE - Create and Send cookies
        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response;


    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}