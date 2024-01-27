import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
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
    const refresh_token = this.createRefreshToken(payload);

    //update user with refresh token
    await this.usersService.updateUserToken(refresh_token, _id);

    // set refresh_token as cookies
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      sameSite: 'none',
      secure: true,
    });
    response.status(200);
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

  async register(registerUserDto: RegisterUserDto) {
    const newUser = await this.usersService.register(registerUserDto);
    // Gửi mail
    return newUser;
    // { _id: newUser?._id, createdAt: newUser?.createdAt };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
      });
      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        //update refresh token
        const { _id, email, fullName, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          fullName,
          email,
          role,
        };
        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        // const userRole = user.role as unknown as { _id: string; name: string };
        // const temp = this.roleService.findOne(userRole._id);

        // set refresh_token as cookies
        response.clearCookie('refresh_token');

        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
          sameSite: 'none',
          secure: true,
        });

        return {
          access_token: this.jwtService.sign(payload),
          // refresh_token,
          user: {
            _id,
            fullName,
            email,
            role,
            // permissions: (await temp).permissions ?? []
          },
        };
      } else {
        throw new BadRequestException(`Refresh token invalid`);
      }
    } catch (error) {
      throw new BadRequestException(`Refresh token invalid`);
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'Logout success';
  };
}
