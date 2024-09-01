import { ConnectDB } from '@/dbConfig/dbConfig'
import { NextRequest, NextResponse } from 'next/server'

ConnectDB()

export async function GET(request: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "Loggout Success",
            success: true
        }, { status: 200 })

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response;


    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}