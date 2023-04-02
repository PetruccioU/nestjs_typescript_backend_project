import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";

@Controller('roles') // префикс для эндпоинта
export class RolesController {
    constructor(private roleService: RolesService) { // Внедрим зависимость, введем RolesService с логикой
    }

    // @Post()  // Формируем реакцию на post запрос с телом, из тела сформируем объект класса CreateRoleDto
    // create(@Body() dto: CreateRoleDto ){
    //     return this.roleService.createRole(dto);   // Вызываем функцию createRole из сервиса RolesService
    // }

    // @Get()   // Формируем реакцию на get запрос с query-параметрами
    // getByValue(@Param('value') value: string){
    //     return this.roleService.getRoleByValue(value);   // Вызываем функцию getRoleByValue из сервиса RolesService
    // }

}
