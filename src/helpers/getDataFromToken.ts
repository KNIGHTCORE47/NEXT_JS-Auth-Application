import JWT from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export function getDataFromToken(request: NextRequest) {
    try {
        const getTokenData = request.cookies.get("token")?.value || ""

        if (!getTokenData) return NextResponse.json({ error: "No token provided" }, { status: 401 })

        const decodedToken: any = JWT.verify(getTokenData, String(process.env.TOKEN_SECRET!))

        if (typeof decodedToken === 'string' || !decodedToken.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        return decodedToken.id

    } catch (error: any) {
        throw new Error(error.message)
    }
}