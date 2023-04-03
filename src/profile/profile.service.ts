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


@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile, // Введём модель Profile
                @InjectModel(Role) private roleRepository: typeof Role, // Введём модель Role
                @InjectModel(User) private userRepository: typeof User,  // Введём модель User
                private roleService: RolesService,        // Введём сервис ролей
                //private usersService: UsersService        // Введём сервис пользователя
    ) {}

    // Сервис авторизации не зависит от сервиса профиля. А сервис профиля - зависит от сервиса авторизации.

    // Публичные функции:
    // Создать пользователя.
    async createUser(dto: CreateUserDto, dtoProfile: UpdateProfileDto) {      // Функция принимает параметр dto, ждет объект класса CreateUserDto.
        const user = await this.userRepository.create(dto);                   // Обращаемся к нашей базе данных и передаем ей объект dto для создания пользователя.
        const role = await this.roleService.getRoleByValue('USER');       // при создании пользователя по умолчанию добавим ему роль USER (заранее добавив роль USER в таблицу roles).
        await user.$set('roles', [role.Id_role])
        user.roles = [role]
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
        const users = await this.roleRepository.create({value:value, description:description});  // Создаём роль, разворачивая dto
        return users;
    }

    // !!!!!!!!!!!!!  $set
    // Выдать пользователю роль.
    async setRole(dto: UpdateRoleDto){
        const user = await this.userRepository.findByPk(dto.userId);     // Находим пользователя по id, роль которого хотим поменять.
        const role = await this.roleService.getRoleByValue(dto.value);   // Находим роль по ее наименованию из таблички ролей.
        if (role && user) {                    // Проверяем нашлись ли пользователь и роль.
            await user.$set('Id_role', [role.Id_role]); // в поле roles таблицы пользователей добавим id его новой роли,
            return dto;  // выведем dto
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
    }



    // Функции для админа или себя:
    // Обновим пользователя и его профиль.
    async updateProfile(user, dtoProfile: UpdateProfileDto): Promise<any> {
        // const user = await this.getUserByEmail(dtoUser.email);
        // if(!user){
        //     throw new Error('Пользователь не найден');
        // }
        const profile = await this.profileRepository.findOne({ where: { ID_user: user.ID_user } });
        await profile.update({...dtoProfile});  // .update(dtoProfile);
        //await user.update(dtoUser);
        return profile;
    }

    // Удалить пользователя и его профиль
    async deleteUser(id): Promise<void> {
        await this.profileRepository.destroy({where: {ID_user: id}});
        await this.userRepository.destroy({where: {ID_user: id}});
    }


    // // Внутренняя функция:
    // async getUserByEmail(email: string) {
    //     const users = await this.userRepository.findOne({where:{email}, include: {all: true}});  // добавим опцию where, чтобы получать пользователя по email
    //     return users;
    // }
    getAllProfiles() {
        return Promise.resolve(undefined);
    }
}
