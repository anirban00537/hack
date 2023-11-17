import { UserService } from '@/modules/user/user.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      const user = await this.userService.findById(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

      if (!requiredRoles) {
        request['user'] = user;

        return true;
      }

      const userRoles = user.roles.map((role) => role.name);

      if (!userRoles.some((value) => requiredRoles.includes(value))) {
        throw new UnauthorizedException();
      }

      request['user'] = user;
    } catch (err) {

      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
