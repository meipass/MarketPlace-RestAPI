import { type User } from "../interfaces/user.interface.js"
import * as tokens from "../utils/jwt.js"
import * as bcrypt from "bcrypt"
import * as authRepository from "../repositories/auth.repository.js"

export async function registerUser(email: string, login: string, password: string): Promise<User | null> {
    const isAlreadyRegistredLogin = await authRepository.findUserByLogin(login)
    if (isAlreadyRegistredLogin) {
        throw new Error("Invalid credentials")
    }

    const isAlreadyRegistredEmail = await authRepository.findUserByEmail(email)
    if (isAlreadyRegistredEmail) {
        throw new Error("Invalid credentials")
    }

    const passwordHashed = await bcrypt.hash(password, 10)

    const user = await authRepository.registerUser(email, login, passwordHashed)
    if (!user) {
        throw new Error("Couldn't register a new user")
    }

    return user
}

export async function loginUser(email: string, password: string): Promise<{accessToken: string, refreshToken: string} | null> {
    const authUser = await authRepository.getAuthUser(email)
    if (!authUser) {
        throw new Error("Bad credentials")
    }

    const isPasswordMatches = await bcrypt.compare(password, authUser.passwordHash)
    if (!isPasswordMatches) {
        throw new Error("Bad credentials")
    }

    const userId = authUser.id
    const accessToken = tokens.generateAccessToken({ userId: userId })
    const refreshToken = tokens.generateRefreshToken({ userId: userId })

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await authRepository.saveRefreshToken(authUser.id, refreshTokenHash, expiresAt)

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

export async function getMatchingTokenId(userId: number, refreshToken: string): Promise<number | null> {
    const tokens = await authRepository.getActiveRefreshTokens(userId)

    for (const token of tokens) {
        if (await bcrypt.compare(refreshToken, token.tokenHash)) {
            return token.id
        }
    }

    return null
}

export async function logOutUser(refreshToken: string) {
    const payload = tokens.verifyRefreshToken(refreshToken)
    if (!payload) {
        throw new Error("Invalid token")
    }

    const tokenId = await getMatchingTokenId(payload.userId, refreshToken)
    if (tokenId === null) {
        throw new Error("Invalid token") 
    }

    await authRepository.revokeRefreshToken(tokenId)
}

export async function refreshUserToken(refreshToken: string): Promise<{accessToken: string, refreshToken: string}> {
    const payload = tokens.verifyRefreshToken(refreshToken)
    if (!payload) {
        throw new Error("Invalid token")
    }

    const tokenId = await getMatchingTokenId(payload.userId, refreshToken)
    if (tokenId === null) {
        throw new Error("Invalid token")
    }

    await authRepository.revokeRefreshToken(tokenId)

    const newRefreshToken = tokens.generateRefreshToken({
        userId: payload.userId
    })

    const newAccessToken = tokens.generateAccessToken({
        userId: payload.userId
    })

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // TODO: make an transation psql
    await authRepository.saveRefreshToken(payload.userId, newRefreshTokenHash, expiresAt)

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }
}
