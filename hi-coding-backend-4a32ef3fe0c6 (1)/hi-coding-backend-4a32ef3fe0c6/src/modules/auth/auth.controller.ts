import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { LoginDTO, RegisterDTO } from '@/modules/auth/dto/auth.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { successResponseBuilder } from '@/utils/responseBuilder';
import { AuthGuard } from '@/guards/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  public async register(@Body() body: RegisterDTO) {
    const response = await this.authService.register(body);
    return successResponseBuilder(response);
  }

  @Post('/login')
  public async login(@Body() body: LoginDTO) {
    const response = await this.authService.login(body);
    return successResponseBuilder(response);
  }

  @UseGuards(AuthGuard)
  @Get('/whoAmI')
  public async whoAmI(@Req() req) {
    return successResponseBuilder(req.user);
  }
}
