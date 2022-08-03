import { Body, Controller, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private authService: AuthService, private userService: UsersService){}

    @Post('register')
    async registerUser(@Body() reg: RegistrationReqModel) {
      return await this.authService.registerUser(reg);
    }

    @UseGuards(JwtAuthGuard)
    @Put('updateProfileDetails')
    async updateUserProfile(@Req() request, @Res() response) {
      return this.userService.updateProfileDetails(request, response)
    }
}
