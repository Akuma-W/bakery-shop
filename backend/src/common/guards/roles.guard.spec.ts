import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { RolesGuard } from '@/common/guards/roles.guard';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  /**
   * Helper function to construct a mock ExecutionContext for guard testing.
   */
  const createMockContext = (user?: { role?: Role; id?: string }): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should grant access when no roles are required on handler or class', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const context = createMockContext();
      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should grant access when empty roles array is defined', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const context = createMockContext();
      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not present on request', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.OWNER]);

      const context = createMockContext(undefined);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied: insufficient permissions',
      );
    });

    it('should throw ForbiddenException when user has no role property', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.OWNER]);

      const context = createMockContext({ id: 'user-id-without-role' });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied: insufficient permissions',
      );
    });

    it('should throw ForbiddenException when user role does not match required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.OWNER]);

      const context = createMockContext({ id: 'cust-1', role: Role.CUSTOMER });

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied: role not permitted for this resource',
      );
    });

    it('should grant access when user has matching role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.OWNER]);

      const context = createMockContext({ id: 'owner-1', role: Role.OWNER });
      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should grant access when user matches one of multiple accepted roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Role.OWNER, Role.CUSTOMER]);

      const context = createMockContext({ id: 'cust-1', role: Role.CUSTOMER });
      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});

