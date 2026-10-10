import { type AuthPayload } from "./authPayload.interface.js"

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export {}
