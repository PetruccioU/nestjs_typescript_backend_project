import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // вытаскивает jwt токен из заголовка запроса
            secretOrKey: process.env.PRIVATE_KEY || 'SECRET',         // секретный ключ для токена
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload.username);
        if (!user) {
            throw new UnauthorizedException('Пользователь не авторизован');
        }
        return user;
    }
}


// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from './auth.service';
//
// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//     constructor(private authService: AuthService) {
//         super();
//     }
//
//     async validate(username: string, password: string): Promise<any> {
//         const user = await this.authService.validateUser(username, password);
//         if (!user) {
//             throw new UnauthorizedException();
//         }
//         return user;
//     }
// }