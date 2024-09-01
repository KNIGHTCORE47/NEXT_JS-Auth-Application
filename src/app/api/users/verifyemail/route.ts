import { ConnectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'


ConnectDB()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody;
        console.log(token);

        if (!token) return NextResponse.json({ error: "Token is required" }, { status: 400 })

        const user = await User.findOne(
            {
                verifyToken: token,
                verifyTokenExpiry: { $gt: Date.now() }
            }
        )

        if (!user) return NextResponse.json({ error: "Invalid Token" }, { status: 400 })
        console.log(user);


        //NOTE - Token is valid, update user verification status
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save()

        return NextResponse.json({
            messaage: "Email Verified Successfully",
            success: true
        }, { status: 200 })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}