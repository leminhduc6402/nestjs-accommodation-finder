import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(
    user: IUser,
    // , response: Response
  ) {
    const {
      _id,
      email,
      fullName,
      role,
      // , permissions
    } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      fullName,
      email,
      role,
    };
    // const refresh_token = this.createRefreshToken(payload);

    // //update user with refresh token
    // await this.usersService.updateUserToken(refresh_token, _id);

    // set refresh_token as cookies
    // response.cookie('refresh_token', refresh_token, {
    //   httpOnly: true,
    //   maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    //   sameSite: 'none',
    //   secure: true,
    // });
    return {
      access_token: this.jwtService.sign(payload),
      // refresh_token,
      user: {
        _id,
        fullName,
        email,
        role,
        // permissions,
      },
    };
  }
}
