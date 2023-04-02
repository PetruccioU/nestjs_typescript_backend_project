import {Body, Controller, Get, Post} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";

// Создадим и экспортируем отсюда класс UsersController, пометив его декоратором @Controller(из @nestjs/common).
// Создавать роутеры как в express не надо

@ApiTags('Users')          // Пометка для документации swagger
@Controller('users')      // Создадим эндпоинт: декоратор принимает префикс по которому будет отрабатывать контроллер
export class UsersController {

    // применим метод dependency injection: Добавляем класс UsersService в конструктор и используем его без создания его объектов
    constructor(private userService: UsersService) {
    }

    // // Метод для создания пользователей
    // @ApiOperation({summary: 'Create user'})  // декоратор для swagger
    // @ApiResponse({status: 200, type: User})
    // @Post() // Чтобы сделать функцию эндпоинтом, пометим её декоратором соответствующего HTTP запроса
    // create(@Body() userDto: CreateUserDto){    // Декоратор Body указывает на то, что мы получаем userDto из тела http-запроса
    //     return this.userService.createUser(userDto)  // Делегировали логику методу createUser из сервиса UsersService
    // }
    //
    // @ApiOperation({summary: 'Get all users'})  // декоратор для swagger
    // @ApiResponse({status: 200, type: [User]})
    // @Get() // Чтобы сделать функцию эндпоинтом, пометим её декоратором соответствующего HTTP запроса
    // getAll(){ // Делегировали логику методу getAllUsers из сервиса UsersService
    //     return this.userService.getAllUsers()
    // }
}
