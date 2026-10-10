import { type User } from "../interfaces/user.interface.js"
import * as authRepository from "../repositories/auth.repository.js"

export async function getMyProfile(userId: number): Promise<User | null> {
    return authRepository.findUserById(userId)
}
