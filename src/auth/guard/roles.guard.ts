import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import { ConfigModule, ConfigService } from '@nestjs/config';
import process from "process";

@Injectable()
export class RolesGuard implements CanActivate {  // Наследуем класс CanActivate.
    constructor(private jwtService: JwtService,
                private reflector: Reflector,
                private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [  // Передаём роли из декоратора.
                context.getHandler(),
                context.getClass(),
            ])
            if (!requiredRoles) { // Если роль не указана в декораторе, эндпоинт будет публичным.
                return true;
            }
            const req = context.switchToHttp().getRequest();   // Берем контекст из запроса.
            const authHeader = req.headers.authorization;      // Смотрим в заголовок авторизации.
            const bearer = authHeader.split(' ')[0]         // Выделяем bearer.
            const token = authHeader.split(' ')[1]          // Выделяем accessToken.
            if (bearer !== 'Bearer' || !token) {    //  Если префикс не Bearer или отсутствует токен, пользователь не авторизован.
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }
            const secret = this.configService.get<string>('JWT_ACCESS_SECRET');   // Возьмем из переменной окружения секрет для токена.
            const user = this.jwtService.verify(token, { secret });   // Проверяем токен accessToken.
            req.user = user;  // Вставляем пользователя в объект Request - ответ.
            return requiredRoles.some(role => role === user.roles.value); // Проверяем обладает ли пользователь искомой ролью, если да, то возвращаем true.  //return user.roles.some(role => requiredRoles.includes(role.value));
        } catch (e) {
            console.log(e)
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}