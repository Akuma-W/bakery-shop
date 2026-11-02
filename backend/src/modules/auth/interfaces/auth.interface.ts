import { Role } from '@prisma/client';

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}
