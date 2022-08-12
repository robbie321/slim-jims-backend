import {
  Controller,
  Get,
  Request,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.gaurd';
import { UserSigninReqModel } from './models/user-signin.req.model';


@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  // //login
  // @Post('auth/login')
  // async loginUser(@Body() reg: UserSigninReqModel) {
  //   return await this.authService.validateUserCredentials(reg);
  // }

  //show profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('hello')
  async getHello(): Promise<string>{
    return this.appService.getHello();
  }


}
