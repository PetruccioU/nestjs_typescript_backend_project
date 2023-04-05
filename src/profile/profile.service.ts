import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {RolesService} from "../roles/roles.service";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Profile} from "./profile.model";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {Role} from "../roles/roles.model";
import {CreateRoleDto} from "../roles/dto/create-role.dto";
import {UpdateProfileDto} from "./dto/update-profile.dto";
import {UpdateRoleDto} from "../roles/dto/update-role.dto";
import {UsersService} from "../users/users.service";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import * as bcrypt from 'bcryptjs';
import e from "express";
import {TokenService} from "../token/token.service";


@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile, // Введём модель Profile
                @InjectModel(Role) private roleRepository: typeof Role, // Введём модель Role
                @InjectModel(User) private userRepository: typeof User,  // Введём модель User
                private roleService: RolesService,        // Введём сервис ролей
                private tokenService: TokenService        // Введём сервис токенов
    ) {}

    // Сервис авторизации не зависит от сервиса профиля. А сервис профиля - зависит от сервиса авторизации.

    // Публичные функции:
    // Создать пользователя.
    async createUser(dto: CreateUserDto, dtoProfile: UpdateProfileDto) {      // Функция принимает параметр dto, ждет объект класса CreateUserDto.
        const user = await this.userRepository.create(dto);                   // Обращаемся к нашей базе данных и передаем ей объект dto для создания пользователя.
        const role = await this.roleService.getRoleByValue('USER');       // при создании пользователя по умолчанию добавим ему роль USER (заранее добавив роль USER в таблицу roles).
        await user.$set('roles', role.Id_role)    // Устанавливаем соответствие между полями таблицы    !!!!!!!!!!!!!!!!!!!!!!!!!! 'roles', [role.Id_role] -> roles: [role]
        user.roles = role  // [role]                        // Сохраняем в поле ролией пользователя, объект роли.
        //await user.update({ Id_role: role.Id_role, roles: [role] });                      //  Обновляем значение роли в таблице пользователей
        if (!dtoProfile){const profile = await this.profileRepository.create({});   // Если dto пустое создаём пользователю пустой профиль.
            await profile.update({ ID_user: user.ID_user });                               // Обновляем значение поля ID_user в таблице профилей, на id нового пользователя.
            return user;
        }
        const profile = await this.profileRepository.create({...dtoProfile});       // Создаём пользователю профиль из dtoProfile.
        await profile.update({ ID_user: user.ID_user });
        return user;                                                           // возвращаем пользователя.
    }


    // Функции для админа:
    // Создать новую роль.
    async addRole(value, description) {
        const isRole = await this.roleRepository.findOne({where: {value:value}})
        if (!isRole){const users = await this.roleRepository.create({value:value, description:description});  // Создаём роль, разворачивая dto
            console.log(`Добавлена роль: ${value}.`)
            return users;}
        else {console.log(`Роль: ${value}, уже существует!`)}
    }

    // Выдать пользователю роль.
    async setRole(dto: UpdateRoleDto){
        const user = await this.userRepository.findByPk(dto.userId);     // Находим пользователя по id, роль которого хотим поменять.
        const role = await this.roleService.getRoleByValue(dto.value);   // Находим роль по ее наименованию из таблички ролей.
        if (role && user) {                    // Проверяем нашлись ли пользователь и роль.
            await user.update({ Id_role: role.Id_role });
            await user.update({ roles: role });    // [role]
            // await user.$set('Id_role', [role.Id_role]); // в поле roles таблицы пользователей добавим id его новой роли,
            // await user.$set('roles', [role]);
            return user//dto;  // выведем dto
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
    }


    // Функции для аутентифицированного пользователя:
    // Обновление токенов по сохранённому refreshToken'у.
    async refreshTokenMethod(refreshToken) {
        if(!refreshToken){
            throw new UnauthorizedException({massage: 'Токен отсутствует в запросе'});
        }else {
            const tokenFromDB = await this.tokenService.findRefreshToken(refreshToken);
            const userData = await this.tokenService.validateRefreshToken(refreshToken);
            if(!tokenFromDB || !userData){
                throw new UnauthorizedException({massage: 'Токен отсутствует в базе данных или не действителен'});
            }else {
                const user = await this.userRepository.findByPk(tokenFromDB.ID_user); // Найдем ID пользователя по токену, который принадлежит этому пользователю.
                const role = await this.roleRepository.findByPk(user.Id_role);
                await user.$set('roles', user.Id_role)    // Устанавливаем соответствие между полями таблицы
                user.roles = role  // [role]                        // Сохраняем в поле ролией пользователя, объект роли.

                const tokens = await this.tokenService.generateTokens({email:user.email, password: user.password, roles: user.roles});
                await this.tokenService.save_or_refresh_refreshToken(user.ID_user, tokens.refreshToken);
                console.log(`Был обновлён accessToken, пользователя: ${tokenFromDB.ID_user}.`);
                return {...tokens, user}
            }
        }
    }



    // Просмотреть профили всех пользователей.
    getAllProfiles() {
        return this.profileRepository.findAll();
        //return Promise.resolve(undefined);
    }

    // Функции для админа или себя:
    // Обновим пользователя.
    async updateUser(id, dtoUser: UpdateUserDto): Promise<any> {
        const checkEmail = await this.userRepository.findOne({where:{email:dtoUser.email}}) // Проверим, вдруг почта на которую мы хотим поменять, уже используется.
        if (checkEmail){   // Сделаем проверку, вдруг пользователь с таким email уже существует.
            throw new HttpException(`Пользователь с почтовым адресом ${dtoUser.email} уже существует`, HttpStatus.BAD_REQUEST)
        }
        const userFind = await this.userRepository.findByPk(id);
        const role = await this.roleRepository.findByPk(userFind.Id_role);
        const hashPassword = await bcrypt.hash(dtoUser.password, 5);       // Хэшируем новый пароль.
        await userFind.update({...dtoUser, password: hashPassword});   // Обновляем пользователя.
        await userFind.$set('roles', userFind.Id_role)    // Устанавливаем соответствие между полями таблицы
        userFind.roles = role  // [role]                        // Сохраняем в поле ролией пользователя, объект роли.
        // Генерируем токены данные о пользователе: почта, пароль, роль пользователя:
        const tokens = await this.tokenService.generateTokens({email:userFind.email, password: userFind.password, roles: userFind.roles});
        await this.tokenService.save_or_refresh_refreshToken(userFind.ID_user, tokens.refreshToken);    // Обновим refreshToken в табличке token.
        console.log(`Пользователь ${id} изменён.`);
        return {...tokens, userFind}  // Возвращаем токены и пользователя.
    }

    // Удалить пользователя и его профиль
    async deleteUser(UserId): Promise<void> {
        await this.profileRepository.destroy({where: {ID_user: UserId}});
        await this.userRepository.destroy({where: {ID_user: UserId}});
        console.log(`Пользователь ${UserId} удалён.`)}
}

