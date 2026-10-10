import type { Response, Request } from "express"
import * as userService from "../services/user.service.js"

export async function getMyProfileController(req: Request, res: Response) {
    const userId = req.user?.userId
    if (!userId) {
        return res.status(401).json("Unauthorized")
    }

    const user = await userService.getMyProfile(userId)
    if (!user) {
        return res.status(404).json("No such user")
    }

    return res.json(user)
}
