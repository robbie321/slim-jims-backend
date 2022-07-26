import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import * as bcrypt from 'bcrypt';

import { RegistrationRespModel } from 'src/models/registration.resp.model';
import { UserSigninReqModel } from 'src/models/user-signin.req.model';
import { UserSigninResModel } from 'src/models/user-signin.res.model';
import { JwtPayload } from './admin.strategy';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private user: Repository<User>
  ) {}


  //validate sign in credentials
  public async validateUserCredentials(
    data: UserSigninReqModel,
  ): Promise<UserSigninResModel> {
    const user = await this.user.findOne({ email: data.email });
    const result = new UserSigninResModel();
    if (!data.email) {
      result.message = 'Email cant be empty';
      result.successStatus = false;
      return result;
    }
    const emailRule =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRule.test(data.email.toLowerCase())) {
      result.message = 'Invalid email';
      result.successStatus = false;
      return result;
    }
    if (user == null) {
      result.message = 'user not found';
      result.successStatus = false;
      return result;
    }
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      result.message = 'invalid Password';
      result.successStatus = false;
      return result;
    }
    const userId = user.userId;
    const email = user.email;
    // const { refreshToken, refreshTokenExp } = await this.getRefreshToken(
    //   userId,
    // );
    const signInToken = await this.getJwtToken({
      userId: user.userId,
      role: user.role,
    });
    console.log(signInToken);

    result.successStatus = true;
    result.message = 'login successful';
    result.userId = user.userId;
    result.role = user.role;
    result.token = signInToken;
    // result.refreshToken = refreshToken;
    // result.refreshTokenExp = refreshTokenExp;
    return result;
  }

  async findByPayload({ userId }: any): Promise<any> {
    return await this.user.findOne({
      where: { userId },
    });
  }


  async validateUser(userId): Promise<any> {

    //find user by id
    const user = await this.findByPayload(userId);

    //returns exception if no user is found
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }


  //returns a user
  async checkUserRole(userId) : Promise<any> {
    const user = await this.findByPayload(userId);

    //returns exception if user is not an admin
    if (user.role != 'admin') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
}



  // //register user
  public async registerUser(
    regModel: RegistrationReqModel,
  ): Promise<RegistrationRespModel> {
    const result = new RegistrationRespModel();
    const errorMessage = await this.registrationValidation(regModel);
    if (errorMessage) {
      result.message = errorMessage.message;
      result.successStatus = false;
      return result;
    }
    const signUpToken = await this.getJwtToken({
      role: 'user',
    });
    const newUser = new User();
    newUser.name = regModel.name;
    newUser.email = regModel.email;
    newUser.phoneNumber = regModel.phoneNumber;
    newUser.firstAddress = regModel.firstAddress;
    newUser.secondAddress = regModel.secondAddress;
    newUser.county = regModel.county;
    newUser.eircode = regModel.eircode;
    newUser.password = await this.getPasswordHash(regModel.password);
    await this.user.insert(newUser);
    result.successStatus = true;
    result.message = 'success';
    result.token = signUpToken;
    return result;
  }
  private async getPasswordHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  public async getJwtToken(dataToken): Promise<string> {
    const payload = {
      ...dataToken,
    };
    return this.jwtService.signAsync(payload);
  }

  //validate registration
  private async registrationValidation(
    regModel: RegistrationReqModel,
  ): Promise<RegistrationRespModel> {
    const result = new RegistrationRespModel();
    if (!regModel.email) {
      result.message = 'Email cant be empty';
      result.successStatus = false;
      return result;
    }
    const emailRule =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRule.test(regModel.email.toLowerCase())) {
      result.message = 'Invalid email';
      result.successStatus = false;
      return result;
    }
    const user = await this.user.findOne({ email: regModel.email });
    if (user != null && user.email) {
      result.message = 'Email already exist';
      result.successStatus = false;
      return result;
    }
    if (regModel.password !== regModel.confirmPassword) {
      result.message = 'Confirm password not matching';
      result.successStatus = false;
      return result;
    }
  }
}