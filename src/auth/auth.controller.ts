import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/customDecorator/customize';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    // private rolesService: RolesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @ApiOperation({ summary: 'Login' })
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
    return await this.authService.register(registerUserDto);
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
}
