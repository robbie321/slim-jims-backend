import {
  Controller,
  Get,
  Request,
  Post,
  Req,
  Res,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Express, request, response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
// import { LocalAuthGuard } from './auth/local-auth.gaurd';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.gaurd';
import { UsersService } from './users/users.service';
import { UserSigninReqModel } from './models/user-signin.req.model';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}

  //login
  @Post('auth/loginJWT')
  async loginUser(@Body() reg: UserSigninReqModel) {
    return await this.authService.validateUserCredentials(reg);
  }

  //show profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
