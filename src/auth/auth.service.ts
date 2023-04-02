import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import * as bcrypt from 'bcryptjs';
import {User} from "../users/users.model";
import {ProfileService} from "../profile/profile.service";
import {UpdateProfileDto} from "../profile/dto/update-profile.dto";
import * as uuid from 'uuid'
import {UpdateRoleDto} from "../roles/dto/update-role.dto";
import {CreateRoleDto} from "../roles/dto/create-role.dto";
import {MailService} from "./mail.service/mail.service";
import {TokenService} from "../token/token.service";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {InjectModel} from "@nestjs/sequelize";
import * as process from "process";
import {UsersService} from "../users/users.service";

@Injectable() // Пометив класс декоратором, сделаем его открытым для метода "dependency injection".
export class AuthService {
    // Для создания пользователя нам понадобятся сервисы UsersService, ProfileService и JwtService.
    // В общем случае для авторизации, рекомендуется использовать библиотеку passport.js, но мы реализуем все через JwtService.
    constructor(@InjectModel(User) private userRepository: typeof User,  // Введём модель User
                private userService: UsersService,       // Введём сервис UsersService, как приватную переменную userService.
                //private readonly jwtService: JwtService,          // Аналогично введем JwtService.
                private readonly profileService: ProfileService,   // Введём сервис ProfileService.
                private readonly mailService: MailService,   // Введём сервис почты.
                private readonly tokenService: TokenService,   // Введём сервис почты.
    ) {}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Регистрация нового пользователя
    async registration(userDto: CreateUserDto, dtoProfile: UpdateProfileDto) {
        const condidate = await this.userService.getUserByEmail(userDto.email); // Ищем пользователя по email.
        if (condidate){   // Сделаем проверку, вдруг пользователь с таким email уже существует.
            throw new HttpException(`Пользователь с почтовым адресом ${userDto.email} уже существует`, HttpStatus.BAD_REQUEST)
        }
        // Захэшируем пароль, если пользователя с таким емэйлом нет.
        const hashPassword = await bcrypt.hash(userDto.password, 5); // Первым параметром передаём пароль из Dto, а вторым соль.
        const activationLink = uuid.v4();        // Создаём ссылку для активации аккаунта.
        // Создаём пользователя.
        const user = await this.profileService.createUser({...userDto, password: hashPassword, activationLink: activationLink},{...dtoProfile}); // Разворачиваем userDto и перезаписываем пароль.
        try {
            await this.mailService.sendActivationLink(userDto.email, `${process.env.API_URL}/auth/activate/${activationLink}`);  // Отправляем письмо со ссылкой на активационный эндпоинт.
            console.log('Активационная ссылка успешно отправлена');
        } catch (error) {
            console.error('При отправке активационной ссылки, произошла ошибка:', error);
        }
        const tokens = await this.tokenService.generateTokens({...userDto});   // Генерируем токены из объекта класса CreateUserDto
        await this.tokenService.saveToken(user.ID_user, tokens.refreshToken);    // Запишем refreshToken в табличку token
        console.log(`Зарегистрирован пользователь ${user.ID_user}`)
        return {...tokens, user}  // Возвращаем токены и пользователя
    }



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Функции для зарегистрированных пользователей:
    // Выполним активацию пользователя.
    async activate(activationLink){
        const user = await this.userRepository.findOne({where:{activationLink}, include: {all: true}}); // Ищем пользователя по activationLink
        if(!user){
            throw new Error('Некорректная ссылка активации')   // Если он не найден, ошибка
        }
        await user.update({isActivated: true})   // Если найден ставим его поле isActivated в true
        console.log(`Пользователь ${user.ID_user} активирован.`)
        //user.isActivated=true;
        //await user.save;
    }

    // Авторизация.
    async login(userDto: CreateUserDto) {   // Функция login ожидает на вход объект userDto(экземпляр класса CreateUserDto).
        const user = await this.userService.getUserByEmail(userDto.email); // Ищем пользователя по email.
        if (!user){   // Сделаем проверку, вдруг пользователь с таким email уже существует.
            throw new HttpException(`Пользователь с почтовым адресом ${userDto.email} не найден`, HttpStatus.BAD_REQUEST)
        }
        const passwordEquals = await bcrypt.compare(userDto.password, user.password)    // Сделаем проверку равенства паролей объекта userDto из БД и проверяемого пользователя
        if(user && passwordEquals) {    // Если емэйл есть в базе и пароль соответствует ему, возвращаем пользователя
            const tokens = await this.tokenService.generateTokens({...userDto});   // Генерируем токены из объекта класса CreateUserDto
            await this.tokenService.saveToken(user.ID_user, tokens.refreshToken);    // Обновим refreshToken в табличке token
            console.log(`Пользователь ${user.ID_user} авторизовался.`)
            return {...tokens, user}  // Возвращаем токены и пользователя
        }
        throw new UnauthorizedException({massage: 'Некорректный пароль'})  // Выбрасываем ошибку при несоответствии пароля или емэйла
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Выход. Только себя.
    async logout(refreshToken) {
        if(!refreshToken){
            throw new UnauthorizedException({massage: 'Токен отсутствует в запросе'})
        }else {
            const tokenFromDB = await this.tokenService.findRefreshToken(refreshToken);
            const userData = await this.tokenService.validateRefreshToken(refreshToken);
            if(!tokenFromDB || !userData){
                throw new UnauthorizedException({massage: 'Токен отсутствует в базе данных или не действителен'})
            }else {
                const token = await this.tokenService.removeToken(tokenFromDB.refreshToken);
                console.log(`Пользователь ${tokenFromDB.ID_user} вышел.`)
                return token;
            }
        }
    }

    // Обновление токена. Если токен валиден и в таблице.
    async refreshTokenM(refreshToken) {
        if(!refreshToken){
            throw new UnauthorizedException({massage: 'Токен отсутствует в запросе'})
        }else {
            const tokenFromDB = await this.tokenService.findRefreshToken(refreshToken);
            const userData = await this.tokenService.validateRefreshToken(refreshToken);
            if(!tokenFromDB || !userData){
                throw new UnauthorizedException({massage: 'Токен отсутствует в базе данных или не действителен'})
            }else {
                const user = await this.userRepository.findByPk(tokenFromDB.ID_user); // Найдем ID пользователя по токену, который принадлежит этому пользователю.
                const token = await this.tokenService.generateTokens({...user});
                return {...token, user}
            }
        }
    }

    // Просмотреть профили пользователей.
    async getAllProfiles(){
        return this.profileService.getAllProfiles()
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Функции только для админа:
    // Получить всех пользователей.
    async getAllUsers() {
        const users = await this.userService.getAllUsers();
        return users;
    }

    // Добавление роли.
    async addRole(value:string, description:string){
        return await this.profileService.addRole(value, description)
    }

    // Выдача роли.
    async setRole(dto: UpdateRoleDto){
        return await this.profileService.setRole(dto)
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Функции для админа либо себя:
    // Обновление пользователя.
    async updateProfile(userDto: UpdateUserDto, profileDto: UpdateProfileDto, ){
        const user = await this.userService.getUserByEmail(userDto.email);
        if(!user){
            throw new Error('Пользователь не найден');
        }
        return await this.profileService.updateProfile(user, profileDto)
    }

    // Удаление пользователя.
    async deleteUser(id) {   // deleteUser(userDto: CreateUserDto)
        //const user = await this.getUserByEmail(userDto.email)
        return await this.profileService.deleteUser(id)
    }

}

// import {UsersService} from "../users/users.service";
// import * as MailService from "./mail.service/mail.service";
// const MailService = require('./mail.service/mail.service');
// import {CreateProfileDto} from "../profile/dto/create-profile.dto";
// import {ApiBadRequestResponse} from "@nestjs/swagger";
// import {JwtService} from "@nestjs/jwt";

