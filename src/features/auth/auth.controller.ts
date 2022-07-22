import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async getUserData() {
    return null;
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto) {
    return null;
  }

  @Post('registration')
  registration(@Body() createAuthDto: CreateAuthDto) {
    return null;
  }

  @Post('registration-confirmation')
  confirmRegistration(@Body() createAuthDto: CreateAuthDto) {
    return null;
  }

  @Post('registration-email-resending')
  resendRegistrationEmail(@Body() createAuthDto: CreateAuthDto) {
    return null;
  }

  @Post('logout')
  logout(@Body() createAuthDto: CreateAuthDto) {
    return null;
  }

  @Post('refresh-token')
  refreshToken(@Body() createAuthDto: CreateAuthDto) {
    return null;
  }
}
