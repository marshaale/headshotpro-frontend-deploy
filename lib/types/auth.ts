export interface User {
  _id: string;
  username?: string;
  email: string;
  isActive: boolean;
  credits: number;
  role: string;
  emailVerified: boolean;
}

export interface BaseResponse {
  message: string;
  success: boolean;
}
