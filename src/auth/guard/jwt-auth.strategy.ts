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
            const accessToken = authHeader.split(' ')[1];   //  От Authorization отбрасываем Bearer и берём accessToken.
            if (!accessToken) {
                new UnauthorizedException({ message: 'В заголовке отсутствует токен' });
            }
            const userData = await this.tokenService.validateAccessToken(accessToken) // Проверяем валидность accessToken'а.
            if(!userData){
                new UnauthorizedException({massage: 'Токен не действителен'})
            }
            req.user = userData;  // В запрос записываем данные пользователя, возвращенные из validateAccessToken если токен оказался валиден.
            console.log(`При аутентификации пользователя(JwtAuthGuard), в объект запроса были вписаны данные: ${JSON.stringify(userData)}`)
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: 'Ошибка валидации токена' });
        }
    }
}