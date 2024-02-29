import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserLoginWithGGDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: UserLoginWithGGDto, done: Function) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.findUserByEmail(payload.email);
    return user ? done(null, user) : done(null, null);
  }
}
