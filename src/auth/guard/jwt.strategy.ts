import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {TokenService} from "../../token/token.service";


@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        return this.validateToken(req);
    }

    // Проверим токен с помощью метода validateAccessToken из сервиса tokenService, который использует jwt верификацию.
    async validateToken(req) {
        try {
            const authHeader = req.headers.authorization; //  Ищем хэдер Authorization.
            if (!authHeader) {
                new UnauthorizedException({ message: 'Заголовок отсутствует' });
            }
            const accessToken = authHeader.split(' ')[1];   //  Из Authorization отбрасываем Bearer и берём accessToken.
            if (!accessToken) {
                new UnauthorizedException({ message: 'В заголовке отсутствует токен' });
            }
            const userData = await this.tokenService.validateAccessToken(accessToken) // Проверяем валидность accessToken'а.
            if(!userData){
                new UnauthorizedException({massage: 'Токен не действителен'})
            }
            req.user = userData;  // В запрос записываем accessToken.
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: 'Ошибка валидации токена' });
        }
    }
}



// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { AuthService } from '../auth.service';
//
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(private readonly authService: AuthService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // вытаскивает jwt токен из заголовка запроса
//             secretOrKey: process.env.PRIVATE_KEY || 'SECRET',         // секретный ключ для токена
//         });
//     }
//
//     async validate(payload: any) {
//         const user = await this.authService.validateUser(payload.username);
//         if (!user) {
//             throw new UnauthorizedException('Пользователь не авторизован');
//         }
//         return user;
//     }
// }
