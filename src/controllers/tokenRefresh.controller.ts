import type { Response, Request } from "express"
import * as authService from "../services/auth.service.js"

export async function refreshTokenController(req: Request, res: Response) {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token is required"
        })
    }

    const result = await authService.refreshUserToken(refreshToken)

    return res.status(200).json(result)
}
