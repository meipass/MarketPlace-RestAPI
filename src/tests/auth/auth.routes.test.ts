import { describe, it, expect, vi } from "vitest";
import request from "supertest";

import * as authService from "../../modules/auth/auth.service.js";
import app from "#app/app/app";

vi.mock("../../modules/auth/auth.service.js", () => ({
  loginUser: vi.fn(),
}));

describe("POST /auth/login", () => {
  it("should login successfully", async () => {
    vi.mocked(authService.loginUser).mockResolvedValue({
      access: "fake-access-token",
      refresh: "fake-refresh-token",
    });

    const response = await request(app).post("/auth/login").send({
      login: "tester1",
      password: "tester123456",
    });

    expect(response.status).toBe(200);

    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"]?.[0]).toContain("HttpOnly");
    expect(response.headers["set-cookie"]?.[0]).toContain("accessToken");
    expect(response.headers["set-cookie"]?.[1]).toContain("HttpOnly");
    expect(response.headers["set-cookie"]?.[1]).toContain("refreshToken");
  });
});
