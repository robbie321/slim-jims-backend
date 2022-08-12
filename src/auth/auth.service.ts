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
    private jwtService: JwtService,
    @InjectRepository(User) private user: Repository<User>
  ) {}


  //validate sign in credentials
  public async validateUserCredentials(data: UserSigninReqModel): Promise<UserSigninResModel> {

    //find email provided
    const user = await this.user.findOne({ email: data.email });

    //instantiate new sign in model
    const result = new UserSigninResModel();

    //if email is empty
    if (!data.email) {
      result.message = 'Email cant be empty';
      result.successStatus = false;
      return result;
    }

    //validate email regex
    const emailRule =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      //respond if email is not valid
    if (!emailRule.test(data.email.toLowerCase())) {
      result.message = 'Invalid email';
      result.successStatus = false;
      return result;
    }

    //if no email is found
    if (user == null) {
      result.message = 'user not found';
      result.successStatus = false;
      return result;
    }

    //validate password with bycrpt
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    //return invalid if no match
    if (!isValidPassword) {
      result.message = 'invalid Password';
      result.successStatus = false;
      return result;
    }

    //put the user id and role into the JWT token
    const signInToken = await this.getJwtToken({
      userId: user.userId,
      role: user.role,
    });

    //assign valus to sign in model
    result.successStatus = true;
    result.message = 'login successful';
    result.userId = user.userId;
    result.role = user.role;
    result.token = signInToken;

    return result;
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

  async findByPayload({ userId }: any): Promise<any> {
    return await this.user.findOne({
      where: { userId },
    });
  }


  //returns a user
  async checkUserRole(userId) : Promise<any> {
    const user = await this.findByPayload(userId);

    console.log(user);

    //returns exception if user is not an admin
    if (user.role != 'admin') {
      console.log(user.role);

      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
}



  // //register user
  public async registerUser(
    regModel: RegistrationReqModel,
  ): Promise<RegistrationRespModel> {
    //instantiate new registration response model
    const result = new RegistrationRespModel();

    //validate regritration request
    const errorMessage = await this.registrationValidation(regModel);

    //if error is true set successStatus to false
    if (errorMessage) {
      result.message = errorMessage.message;
      result.successStatus = false;
      return result;
    }

    //add the role to the jwt
    const signUpToken = await this.getJwtToken({
      role: 'user',
    });

    //create a new user
    const newUser = new User();
    newUser.name = regModel.name;
    newUser.email = regModel.email;
    newUser.phoneNumber = regModel.phoneNumber;
    newUser.firstAddress = regModel.firstAddress;
    newUser.secondAddress = regModel.secondAddress;
    newUser.county = regModel.county;
    newUser.eircode = regModel.eircode;
    newUser.password = await this.getPasswordHash(regModel.password); //hash the password
    await this.user.insert(newUser); //insert to the database
    result.successStatus = true;
    result.message = 'success';
    result.token = signUpToken;
    return result;
  }


  //hash the password with bycrypt
  private async getPasswordHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  //return the jwt from the jwt service
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

    //email regex
    const emailRule =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      //check if email provided matches the regex
    if (!emailRule.test(regModel.email.toLowerCase())) {
      result.message = 'Invalid email';
      result.successStatus = false;
      return result;
    }

    //check if email exists
    const user = await this.user.findOne({ email: regModel.email });

    //if email is in the database, return message
    if (user != null && user.email) {
      result.message = 'Email already exist';
      result.successStatus = false;
      return result;
    }

    //return false if passwords do not match
    if (regModel.password !== regModel.confirmPassword) {
      result.message = 'Confirm password not matching';
      result.successStatus = false;
      return result;
    }
  }
}