import type { Response, Request, NextFunction } from "express"
import * as tokens from "../utils/jwt.js"

function isString(input: unknown): boolean {
    return typeof (input) === "string"
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization

    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json("Unauthorized")
    }

    const token = header.slice(7)

    const payload = tokens.verifyAccessToken(token)
    if (!payload) {
        return res.status(401).json("Invalid access token")
    }

    req.user = payload

    next()
}

export function registerMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        return res.status(400).json("Invalid body")
    }

    const { email, login, password } = req.body
    if (!isString(email) || !isString(login) || !isString(password)) {
        return res.status(400).json("Invalid credentials")
    }

    next()
}
