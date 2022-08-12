import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import * as bcrypt from 'bcrypt';
import { RegistrationRespModel } from 'src/models/registration.resp.model';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private users: Repository<User>){}

  async updateProfileDetails(request: any, response: any) : Promise<any>{
    //get user id from bearer token
    const {userId} = request.user;

    //assign values to the request body
    const {
      named,
      mobile,
      addressLineOne,
      addressLineTwo,
      county,
      eircode} = request.body;

        // update the user by id with the new values from the body
          const user = await this.users.createQueryBuilder('users')
          .update(User)
          .set({ name: named, phoneNumber: mobile, firstAddress: addressLineOne, secondAddress: addressLineTwo, county: county, eircode: eircode})
          .where('users.userId = :userId',{userId})
          .execute();

          return response.status(200).json(user)
  }


}