import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { User } from '../../modules/users/users.model';
import * as bcrypt from 'bcryptjs';

import { Validator } from '../../utils/validation/validator';
import { UserSchema, LoginSchema } from '../../utils/validation/user.schema';

@Injectable()
export class UsersService {
  constructor(
    private repository: UsersRepository,
    private auth: AuthService,
    private validator: Validator,
  ) {}

  // register user
  async create(params: {
    username: User[`username`];
    password: User[`password`];
    email: User[`email`];
  }) {
    try {
      // validate payload
      params = this.validator.validate(UserSchema, params);

      // check if user exists
      const user = await this.repository.getUser({
        where: {
          email: params.email,
        },
      });

      if (user) throw new ConflictException('User already exists.');

      const { username, email, password } = params;

      // hash password
      const saltOrRounds = Number(process.env.SALT);
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);

      return this.repository.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      const message = error.meta?.cause || error.message;
      throw new Error(message);
    }
  }

  // user login
  async login(params: {
    password: User[`password`];
    email: User[`email`];
  }): Promise<User> {
    try {
      // validate payload
      params = this.validator.validate(LoginSchema, params);

      // check if user exists
      const user = await this.repository.getUser({
        where: {
          email: params.email,
        },
      });

      // verify user password
      const match = user
        ? await bcrypt.compare(params.password, user.password)
        : false;

      // throw error if user does not exist or mismatched passwords
      if (!match)
        throw new NotFoundException('Please check credentials and try again.');

      // generate authorization token
      const { id, username } = user;
      const token: string = this.auth.generateToken({
        id,
        username,
      });

      return {
        ...user,
        token,
      };
    } catch (error) {
      const message = error.meta?.cause || error.message;
      throw new Error(message);
    }
  }
}
