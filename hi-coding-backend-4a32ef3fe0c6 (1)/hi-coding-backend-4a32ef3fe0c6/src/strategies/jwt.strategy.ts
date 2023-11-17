import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

// TODO impletemt this
// import { AuthService } from '@/modules/auth/auth.service';

export interface JwtPayload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // TODO impletemt this
  // constructor(private authService: AuthService) {
  //   super({
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     secretOrKey: 'secret',
  //   });
  // }
  // async validate(payload: JwtPayload) {
  //   const user = await this.authService.findByID(payload.id);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }
}
