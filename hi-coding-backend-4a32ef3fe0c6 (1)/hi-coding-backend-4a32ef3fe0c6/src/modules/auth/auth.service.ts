import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginDTO, RegisterDTO } from '@/modules/auth/dto/auth.dto';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

  public async register(body: RegisterDTO) {
    const roles = body.roles;
    const userRoles = await this.userService.getUserRoles(roles);

    // @ts-ignore
    body.roles = userRoles.map((role) => `${role._id}`);

    return await this.userService.create(body);
  }

  public async login(body: LoginDTO) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const { _id, password, ...rest } = user;

    return {
      access_token: await this.jwtService.signAsync({ id: _id, ...rest }),
    };
  }
}
