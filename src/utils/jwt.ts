import jwt from "jsonwebtoken"
import { type AuthPayload } from "../interfaces/authPayload.interface.js"
import "dotenv/config"

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET!
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET

export function generateAccessToken(payload: AuthPayload): string {
    return jwt.sign(payload, ACCESS_JWT_SECRET, {
        expiresIn: "15m"
    })
}

export function generateRefreshToken(payload: AuthPayload): string {
    return jwt.sign(payload, REFRESH_JWT_SECRET, {
        expiresIn: "30d"
    })
}

export function verifyAccessToken(token: string): AuthPayload {
    return jwt.verify(token, ACCESS_JWT_SECRET) as AuthPayload
}

export function verifyRefreshToken(token: string): AuthPayload {
    return jwt.verify(token, REFRESH_JWT_SECRET) as AuthPayload
}
