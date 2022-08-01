import { User } from "src/users/user.entity";

export class UserSigninResModel {
    successStatus: boolean;
    message: string;
    userId: number;
    role: string;
    token: string;
  }
