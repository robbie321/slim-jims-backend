import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RegistrationReqModel } from 'src/models/registration.req.model';

@Controller('users')
export class UsersController {
    constructor(private authService: AuthService){}

    @Post('register')
    async registerUser(@Body() reg: RegistrationReqModel) {
      return await this.authService.registerUser(reg);
    }
}
