import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (user?.isDeleted === true) {
            throw new NotFoundException('This account invalid or banned!!!');
        }
        if (!user) {
            throw new UnauthorizedException('Username or Password invalid!!!');
        }
        return user;
    }
}
