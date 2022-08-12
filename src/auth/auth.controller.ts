import {
    Controller,
    Get,
    Request,
    Post,
    Body,
    UseGuards,
  } from '@nestjs/common';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import { UserSigninReqModel } from 'src/models/user-signin.req.model';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.gaurd';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

      //login
  @Post('login')
  async loginUser(@Body() reg: UserSigninReqModel) {
    return await this.authService.validateUserCredentials(reg);
  }

  @Post('register')
  async registerUser(@Body() reg: RegistrationReqModel) {
    return await this.authService.registerUser(reg);
  }

  //show profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
