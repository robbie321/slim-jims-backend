import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationReqModel } from 'src/models/registration.req.model';
import * as bcrypt from 'bcrypt';
import { RegistrationRespModel } from 'src/models/registration.resp.model';
import { Repository } from 'typeorm';
import { User } from './user.entity';

// This should be a real class/interface representing a user entity
export type Users = any;

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private users: Repository<User>){}



}