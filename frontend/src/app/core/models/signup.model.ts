import { User } from "./user.model";

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  }
}