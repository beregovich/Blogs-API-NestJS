import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserData(@Request() req) {
    const userId = req.user.userId;
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new UnauthorizedException();
    return {
      email: user.accountData.email,
      login: user.accountData.login,
      userId,
    };
  }
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const userData = req.user.data;
    res.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: req.user.data.accessToken };
  }

  @Post('registration')
  async registration(@Body() registrationData: RegistrationDto) {
    const user = await this.usersService.createUser(
      registrationData.login,
      registrationData.password,
      registrationData.email,
    );
    return;
  }

  @Post('registration-confirmation')
  async confirmRegistration(@Body('code') confirmationCode) {
    const result = await this.authService.confirmEmail(confirmationCode);
    if (!result) {
      throw new NotFoundException();
    }
    return null;
  }

  @Post('registration-email-resending')
  async resendRegistrationEmail(@Body('email') email: string) {
    const isResented = await this.authService.resendCode(email);
    if (!isResented)
      throw new BadRequestException({
        message: 'email already confirmed or such email not found',
        field: 'email',
      });
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    if (!req.cookie?.refreshToken) throw new UnauthorizedException();
    await this.usersService.addRevokedToken(req.cookie.refreshToken);
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req, @Response() res) {
    if (!req.cookie?.refreshToken) throw new UnauthorizedException();
    const userId = req.user.id;
    const newTokens = this.authService.createJwtTokensPair(userId, null);
    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: newTokens.accessToken };
  }
}
