import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/users.interface';
import {
    RegisterUserDto,
    UserLoginWithGGDto,
} from 'src/users/dto/create-user.dto';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MailService } from 'src/mail/mail.service';
import { ChangePassword, ForgotPassword, VerifyDto } from './dto/auth-dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user) {
            if (user.active === false) {
                throw new ForbiddenException();
            }
            const isValid = this.usersService.isValidPassword(
                pass,
                user.password,
            );
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }

    async validateUserWithSocial(
        email: string,
        fullName: string,
        avatar: string,
    ): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user) {
            return user;
        }
        const userLoginWithGGDto: UserLoginWithGGDto = {
            email,
            fullName,
            avatar,
        };
        const newUser =
            await this.usersService.registerBySocialAccount(userLoginWithGGDto);
        return newUser;
    }

    async findUserByEmail(email: string) {
        return await this.usersService.findOneByEmail(email);
    }

    async login(user: IUser, response: Response) {
        const {
            _id,
            email,
            fullName,
            avatar,
            phone,
            followers,
            followings,
            role,
            // , permissions
        } = user;
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            fullName,
            email,
            avatar,
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
            user: {
                _id,
                fullName,
                email,
                avatar,
                phone,
                followers,
                followings,
                role,
                // permissions,
            },
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        const newUser = await this.usersService.register(registerUserDto);
        return newUser;
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
            await this.usersService.updateUserToken(
                refresh_token,
                _id.toString(),
            );

            // const userRole = user.role as unknown as { _id: string; name: string };
            // const temp = this.roleService.findOne(userRole._id);

            // set refresh_token as cookies
            response.clearCookie('refresh_token');

            response.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: ms(
                    this.configService.get<string>('JWT_REFRESH_EXPIRE'),
                ),
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
    };

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken('', user._id);
        response.clearCookie('refresh_token');
        return 'Logout success';
    };

    verify = async (verifyDto: VerifyDto) => {
        const { email, passcode } = verifyDto;
        const passcodeCache = await this.mailService.getPasscode(email);

        if (passcode !== passcodeCache) {
            throw new UnprocessableEntityException();
        }
        await this.usersService.verifyUser(email);
        await this.cacheManager.del(email);
        return true;
    };

    changePassword = async (
        refreshToken: string,
        changePassword: ChangePassword,
        user: IUser,
    ) => {
        this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
        });
        let isExistUser = await this.usersService.findUserByToken(refreshToken);
        if (isExistUser) {
            const { oldPassword, newPassword, reNewPassword } = changePassword;

            const password = (
                await this.usersService.findOneByEmail(user.email)
            ).password;

            const isValid = await this.usersService.isValidPassword(
                oldPassword,
                password,
            );
            if (!isValid) {
                throw new BadRequestException('Your password not correct');
            }
            if (newPassword !== reNewPassword) {
                throw new BadRequestException('The new passwords do not match');
            }

            return await this.usersService.changePassword(newPassword, user);
        } else {
            throw new NotFoundException('Not Found User');
        }
    };

    forgotPassword = async (forgotPassword: ForgotPassword) => {
        const { email, newPassword } = forgotPassword;
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException();
        }
        const currentUser: IUser = {
            _id: user._id + '',
            fullName: user.fullName,
            email: email,
            avatar: user.avatar,
        };
        return await this.usersService.changePassword(newPassword, currentUser);
    };
}
