import { ConnectDB } from '@/dbConfig/dbConfig'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/helpers/getDataFromToken'


ConnectDB()

export async function POST(request: NextRequest) {
    //NOTE- Extract data from token
    const userId = await getDataFromToken(request)

    if (typeof userId !== 'string') {
        //NOTE - getDataFromToken returned a NextResponse, indicating an error
        return userId
    }

    const user = await User.findOne({ _id: userId }).select("-password")    //NOTE - select("-password") restrict the given values

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({
        message: "User found",
        success: true,
        data: user
    }, { status: 200 })
}