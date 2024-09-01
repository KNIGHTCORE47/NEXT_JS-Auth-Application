import JWT from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export function getDataFromToken(request: NextRequest) {
    try {
        const getTokenData = request.cookies.get("token")?.value || ""

        if (!getTokenData) return NextResponse.json({ error: "Internal server Error" }, { status: 401 })

        const decodedToken: any = JWT.verify(getTokenData, String(process.env.TOKEN_SECRET!))

        return decodedToken.id

    } catch (error: any) {
        throw new Error(error.message)
    }
}