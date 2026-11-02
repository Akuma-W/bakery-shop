import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AuthService } from '@/modules/auth/auth.service';
import { PrismaService } from '@/database/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-uuid-123',
    email: 'test@example.com',
    fullName: 'Test User',
    phone: '0987654321',
    passwordHash: '$2b$12$hashedPasswordExample',
    role: Role.CUSTOMER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return 'test_access_secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
      return null;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password123@',
      fullName: 'Test User',
      phone: '0987654321',
    };

    it('should register a new customer successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result.user.email).toBe('test@example.com');
      expect((result.user as any).passwordHash).toBeUndefined();
      expect(result.accessToken).toBe('mocked.jwt.token');
      expect(result.refreshToken).toBe('mocked.jwt.token');
    });

    it('should throw ConflictException if email is already taken', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123@',
    };

    it('should authenticate user and return tokens when credentials are valid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.login(loginDto);

      expect(result.user.email).toBe(mockUser.email);
      expect((result.user as any).passwordHash).toBeUndefined();
      expect(result.accessToken).toBe('mocked.jwt.token');
      expect(result.refreshToken).toBe('mocked.jwt.token');
    });

    it('should throw UnauthorizedException if email does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should rotate tokens when refresh token is valid', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.refreshTokens('valid.refresh.token');

      expect(result.user.email).toBe(mockUser.email);
      expect(result.accessToken).toBe('mocked.jwt.token');
      expect(result.refreshToken).toBe('mocked.jwt.token');
    });

    it('should throw UnauthorizedException if refresh token is missing', async () => {
      await expect(service.refreshTokens('')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token is expired or invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(service.refreshTokens('invalid.token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return sanitized user profile if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getCurrentUser(mockUser.id);

      expect(result.id).toBe(mockUser.id);
      expect((result as any).passwordHash).toBeUndefined();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getCurrentUser('non-existent-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
