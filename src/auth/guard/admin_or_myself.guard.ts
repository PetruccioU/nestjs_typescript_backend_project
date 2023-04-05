import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {TokenService} from "../../token/token.service";
import {UsersService} from "../../users/users.service";


@Injectable()
export class AdminOrMyselfGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService,
                private readonly usersService: UsersService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        return this.validateToken(req);
    }

    // Проверим токен с помощью метода validateAccessToken из сервиса tokenService, который использует jwt верификацию.
    async validateToken(req) {
        try {
            const authHeader = await req.headers.authorization; //  Ищем хэдер Authorization.
            if (!authHeader) {
                new UnauthorizedException({ message: 'Заголовок отсутствует.' });
            }
            const accessToken = await authHeader.split(' ')[1];   //  От Authorization отбрасываем Bearer и берём accessToken.
            if (!accessToken) {
                new UnauthorizedException({ message: 'В заголовке отсутствует токен.' });
            }
            const userData = await this.tokenService.validateAccessToken(accessToken) // Проверяем валидность accessToken'а.
            if(!userData){
                new UnauthorizedException({massage: 'Токен не действителен.'});
            }
            const hasUserRole = userData.roles.value === 'USER';
            if(hasUserRole){
                req.user = userData;
                console.log(`При аутентификации пользователя(AdminOrMyselfGuard), в объект запроса были вписаны данные: ${JSON.stringify(userData)}`);
                return true
            }
            const hasAdminRole = userData.roles.value === 'ADMIN';
            if(hasAdminRole){
                req.user = {};
                console.log(`При аутентификации пользователя(AdminOrMyselfGuard), в объект запроса были вписаны данные: ${JSON.stringify({})}`);
                return true
            }
        } catch (e) {
            throw new UnauthorizedException({ message: 'AdminOrMyselfGuard: Ошибка валидации пользователя.' });
        }
    }
}

// if(hasUserRole || hasAdminRole){console.log(`При аутентификации пользователя(AdminOrMyselfGuard), в объект запроса были вписаны данные: ${JSON.stringify(userData)}`)}
// else{}
// return hasUserRole || hasAdminRole;

//const roles = userData.roles;
// const hasUserRole = roles.some(role => role.value == 'USER');
// const hasAdminRole = roles.some(role => role.value == "ADMIN");
