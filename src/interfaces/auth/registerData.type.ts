import type { LoginData } from "../loginData.type.jspe.js";

export interface RegisterData extends LoginData {
  login: string;
}
