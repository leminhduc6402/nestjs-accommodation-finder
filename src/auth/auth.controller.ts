import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { AuthService } from './auth.service';
import { VerifyDto } from './dto/auth-dto';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: UserLoginDto })
    @ApiOperation({ summary: 'Login' })
    @UseGuards(ThrottlerGuard)
    @Post('/login')
    @ResponseMessage('User login')
    async handleLogin(
        @Req() req: any,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ApiOperation({ summary: 'Resgister a new user' })
    @ResponseMessage('Resgister a new user')
    @Post('/register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        const user = await this.authService.register(registerUserDto);
        return user;
    }

    @ApiOperation({ summary: 'Get user information when logged in' })
    @ResponseMessage('Get user information')
    @Get('/account')
    handleGetAccount(@User() user: IUser) {
        return { user };
    }

    @Public()
    @ApiOperation({ summary: 'Get user by refresh token' })
    @ResponseMessage('Get user by refresh token')
    @Get('/refresh')
    handleRefreshAccount(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = req.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, response);
    }

    @ApiOperation({ summary: 'Logout user' })
    @ResponseMessage('Logout user')
    @Post('/logout')
    handleLogout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser,
    ) {
        return this.authService.logout(response, user);
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @ResponseMessage('Login with google account')
    @Get('google/login')
    handleLoginWithGoogle() {
        return 'Google Authentication';
    }

    @Public()
    @UseGuards(GoogleAuthGuard)
    @ResponseMessage('Login with google account')
    @Get('google/redirect')
    handleRedirectGoogle(
        @Req() req: any,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @UseGuards(FacebookAuthGuard)
    @ResponseMessage('Login with Facebook account')
    @Get('facebook')
    handleLoginWithFB() {
        return 'Facebook Authentication';
    }

    @Public()
    @UseGuards(FacebookAuthGuard)
    @ResponseMessage('Login with Facebook account')
    @Get('facebook/callback')
    handleRedirectFB(
        @Req() req: any,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage('Verify account')
    @ApiOperation({ summary: 'Verify user by passcode' })
    @ApiBody({ type: VerifyDto })
    @Post('verify')
    async verifyAccount(@Body() verifyDto: VerifyDto) {
        return await this.authService.verify(verifyDto);
    }
}
