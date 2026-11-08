import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/database/prisma.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { UserResponse, AuthTokens, AuthResponse } from '@/modules/auth/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new customer user with bcrypt hashed password and issues auth tokens.
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered in the system');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    const newUser = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        fullName: dto.fullName.trim(),
        phone: dto.phone?.trim() || null,
        passwordHash,
        role: Role.CUSTOMER,
      },
    });

    this.logger.log(`New customer registered successfully: ${newUser.email}`);

    const tokens = await this.generateTokens({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: this.sanitizeUser(newUser),
      ...tokens,
    };
  }

  /**
   * Validates user credentials and issues a new pair of access and refresh tokens.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(`User logged in successfully: ${user.email} (Role: ${user.role})`);

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Verifies an existing refresh token and rotates it with a newly signed token pair.
   */
  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'dev_refresh_secret_key_change_in_production';

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User account no longer exists');
      }

      const tokens = await this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }

  /**
   * Retrieves profile details for a given user ID without sensitive password fields.
   */
  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Generates signed JWT access and refresh token pair for a user.
   */
  private async generateTokens(user: {
    id: string;
    email: string;
    role: Role;
  }): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'dev_access_secret_key_change_in_production';
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      'dev_refresh_secret_key_change_in_production';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Strips sensitive credentials such as passwordHash before returning user object.
   */
  private sanitizeUser(user: any): UserResponse {
    const { passwordHash: _hash, ...sanitized } = user;
    return sanitized;
  }
}
