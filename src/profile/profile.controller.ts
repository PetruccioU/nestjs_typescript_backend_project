import {Body, Controller, Delete, Get, Post, Put} from '@nestjs/common';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import {ProfileService} from "./profile.service";
import {CreateProfileDto} from "./dto/create-profile.dto";

@Controller('profile')
export class ProfileController {

    // constructor(private profileService: ProfileService) {
    // }
    // // Метод для создания пользователей
    // @ApiOperation({summary: 'Create user'})  // декоратор для swagger
    // @ApiResponse({status: 200, type: User})
    // @Post() // Чтобы сделать функцию эндпоинтом, пометим её декоратором соответствующего HTTP запроса
    // create(@Body() userDto: CreateUserDto, profileDto: CreateProfileDto){    // Декоратор Body указывает на то, что мы получаем Dto из тела http-запроса
    //     return this.profileService.createUserWithProfile(userDto,profileDto)  // Делегировали логику
    // }
    //
    // // Получить всех пользователей
    // @ApiOperation({summary: 'Get all users'})  // декоратор для swagger
    // @ApiResponse({status: 200, type: [User]})
    // @Get() // Чтобы сделать функцию эндпоинтом, пометим её декоратором соответствующего HTTP запроса
    // getAll(){ // Делегировали логику методу getAllUsers из сервиса UsersService
    //     return this.profileService.getAllUsers()
    // }

}
