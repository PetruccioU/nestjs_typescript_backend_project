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
import process from "process";

@Injectable()
export class RolesGuard implements CanActivate {  // Наследуем класс CanActivate.
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

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
            const token = authHeader.split(' ')[1]          // Выделяем токен.
            if (bearer !== 'Bearer' || !token) {    //  Если префикс не Bearer или отсутствует токен, пользователь не авторизован.
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }
            const user = this.jwtService.verify(token); // Проверяем токен.  , {secret: process.env.PRIVATE_KEY}
            req.user = user; // Вставляем пользователя в ответ.
            return user.roles.some(role => requiredRoles.includes(role.value));  // Проверяем обладает ли пользователь искомой ролью, если да, то возвращаем true.
        } catch (e) {
            console.log(e)
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}