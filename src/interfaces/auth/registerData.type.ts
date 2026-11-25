import type { LoginData } from "./loginData.type.js";

export interface RegisterData extends LoginData {
  email: string;
}
