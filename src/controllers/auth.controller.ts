import type { Response, Request } from "express"

import * as authService from "../services/auth.service.js"

export async function registerController(req: Request, res: Response) {
    const { email, login, password } = req.body

    const user = await authService.registerUser(email, login, password)
    if (!user) {
        return res.status(400).json("Cant register an user")
    }

    return res.json(user)
}

export async function logOutController(req: Request, res: Response) {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token is required"
        })
    }

    await authService.logOutUser(refreshToken)

    return res.status(204).send()
}

export async function loginController(req: Request, res: Response) {
    const { email, login, password } = req.body

    const tokens = await authService.loginUser(email, password)
    if (!tokens) {
        return res.status(401).json("Unauthorized")
    }

    return res.status(201).json(tokens)
}
