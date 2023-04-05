import {Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import { Roles } from './guard/roles.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.strategy';   // import { JwtAuthGuard } from './guard/jwt.strategy';
import { RolesGuard } from './guard/roles.guard';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {User} from "../users/users.model";
import {UpdateProfileDto} from "../profile/dto/update-profile.dto";
import { Response, Request } from 'express';
import {AdminOrMyselfGuard} from "./guard/admin_or_myself.guard";
// import {CreateProfileDto} from "../profile/dto/create-profile.dto";
// import { CookieSerializeOptions, serialize } from 'cookie';
// import {Profile} from "../profile/profile.model";

@ApiTags('Authorization')  // Контроллер пометим аннотацией ApiTags, для документирования в swagger.
@Controller('auth')       // Префикс аутентификации.
export class AuthController {
    constructor(private authService: AuthService  // Вводим экземпляр класса AuthService, как приватное поле класса AuthController.
    ){}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Регистрация пользователя.
    @Post('/registration')      // Эндпоинт для регистрации.
    async registration(@Body() userDto: CreateUserDto,       // Будем использовать декораторы @Body() и @Res(), для получения payload из запроса и передачи его в переменные userDto и profileDto.
                       @Body() profileDto: UpdateProfileDto, // Для проверки данных из payload на соответствие полям классов CreateUserDto, UpdateProfileDto.
                       @Res() res: Response                   // Используем декоратор @Res() для введения в наш контроллер объекта Response.
    )
    {
        try{ // Обернем функцию в блок try/catch для отслеживания ошибок.
            const userData = await this.authService.registration(userDto, profileDto); // Регистрируем пользователя, делегируя работу сервису авторизации.
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});  // Добавляем куки с refreshToken'ом пользователя к объекту Response.
            // maxAge: срок жизни токена, httpOnly позволяет получать доступ к cookie только посредством http запроса.
            // Только сервер сможет получить этот cookie, при получении следующего запроса от пользователя. Так мы сможем опознать пользователя.
            return res.json(userData); // Возвращаем пользователя в объекте ответа.
        }catch (e) {
            console.log(e) // Выводим ошибку, если она возникла.
        }
    }

    // Активации аккаунта пользователя.
    @Get('/activate/:link')
    async activate(@Req() req: Request, @Res() res: Response) {
        try {
            const activationLink = req.params.link;            // Берём activationLink из параметра link запроса.
            await this.authService.activate(activationLink);   // Вызываем метод сервиса.
            return res.redirect(process.env.CLIENT_URL)        // После перехода по ссылке активации, перенаправляем
            // пользователя на сайт, по умолчанию для React указывают её как http://localhost:3000 в .env, установим яндекс.
        }
        catch (e) {
            console.log(e)
        }
    }

    // Логин.
    @Post('/login')
    async login(@Body() userDto: CreateUserDto, @Res() res: Response) {
        try {
            //const {email, password} = userDto.body
            const userData = await this.authService.login(userDto)
            // Добавляем куки с refreshToken'ом пользователя к объекту Response.
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }
        catch (e) {
            console.log(e)
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Увидеть других пользователей может любой пользователь с валидным accessToken'ом.
    @UseGuards(JwtAuthGuard)
    @Get('get_all_profiles')
    async getProfile() {         // async getProfile(@Body() req) {
        return await this.authService.getAllProfiles();
    }

    // Эндпоинт для обновления токенов. Предпологаем что accessToken уже истек, проверяем refreshToken из cookie, если
    // он валиден и хранится в таблице токенов(пользователь зарегистрирован) - обновляем токены.
    @Get('/refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const {refreshToken} = req.cookies;   // Берем refreshToken из cookies.
            const userData = await this.authService.refreshTokenM(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});  // Добавляем куки с refreshToken'ом пользователя к объекту Response.
            return res.json(userData);
        }
        catch (e) {
            console.log(e)
        }
    }

    // Выход, достаточно иметь refreshToken в куки.
    @Post('/logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const {refreshToken} = req.cookies;   // Берем refreshToken из cookies.
            const token = await this.authService.logout(refreshToken)     // Вызываем функцию из сервиса.
            res.clearCookie('refreshToken')   // Очищаем cookies от refreshToken.
            return res.json(token)
        }
        catch (e) {
            console.log(e)
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Выдать пользователю роль, редактировать профиль может только Администратор, поэтому.
    // Будем проводить проверку RoleGuard'ом на роль 'ADMIN' у пользователя.

    // Администратор может получить всех пользователей:
    @ApiOperation({summary: 'Set users role'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    @Roles('ADMIN')                            // Искомая роль из декоратора ролей.
    @UseGuards(RolesGuard)                     // Используемые гард роли.
    @Get('/get_all_users')                   // Эндпоинт на получение всех пользователей.
    async getAllUser() {
        return this.authService.getAllUsers();
    }

    // Администратор может добавлять в приложение новые роли:
    @ApiOperation({summary: 'Add role to app'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    @UseGuards(RolesGuard)                // Используемые гард на админа.
    @Roles('ADMIN')                            // Искомая роль из декоратора ролей.
    @Post('/add_role')                       // Добавим эндпоинт.
    async addRole(@Body() dto) {
        const {value, description} = dto;
        return this.authService.addRole(value, description);
    }

    // Администратор может выдать роль пользователю:
    @ApiOperation({summary: 'Set users role'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    @UseGuards(RolesGuard)                  // Используемые гарды.
    @Roles('ADMIN')                            // Искомая роль из декоратора ролей.
    @Put('/set_role')                     // Добавим эндпоинт.
    async setRole(@Body() dto) {
        return this.authService.setRole(dto);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Админ или себя:
    // Обновить пароль или почту пользователя, только админ или себя.
    @ApiOperation({summary: 'Update users profile'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(AdminOrMyselfGuard)
    @Put('/update_user')
    async updateUser(@Body()dto, @Req()req) {
        const user = req.user;                             //После проверки accessTokena в JwtAuthGuard, если токен валиден и роль-пользователь, из запроса получим поле user с данными пользователя.
        console.log(`Данные на изменение, user: ${JSON.stringify(user.email)}`);
        console.log(`Данные на изменение, dto: ${JSON.stringify(dto)}`);
        return this.authService.updateUser(dto, user);
    }

    // Удалить пользователя, также только админ или себя.
    @ApiOperation({summary: 'Delete user'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(AdminOrMyselfGuard)
    @Delete('/delete')                  // Чтобы сделать функцию эндпоинтом, пометим её декоратором соответствующего HTTP запроса.
    async delete(@Body()dto, @Req()req){           // Делегировали логику методу getAllUsers из сервиса UsersService   @Body() ID_user.
        const user = await req.user;                //После проверки accessTokena в JwtAuthGuard, если токен валиден, из запроса получим поле user с данными пользователя.
        console.log(`Данные на удаление, user: ${JSON.stringify(user.email)}`);
        console.log(`Данные на удаление, dto: ${JSON.stringify(dto)}`);
        return this.authService.deleteUser(dto, user);
    }
}