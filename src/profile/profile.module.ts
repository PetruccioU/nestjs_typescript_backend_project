import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Role} from "../roles/roles.model";
import {Profile} from "./profile.model";
import {RolesService} from "../roles/roles.service";
import {UsersService} from "../users/users.service";
import {TokenService} from "../token/token.service";
import {Token} from "../token/token.model";

@Module({
  providers: [ProfileService, RolesService, UsersService,TokenService], // Сервисы которые мы будем использовать с этим модулем
  controllers: [ProfileController],
  imports:[SequelizeModule.forFeature([User, Role, Profile, Token])], // сторонние модули и SequelizeModule с моделями которые будут использованы в этом модуле
  exports: [ProfileService]
})
export class ProfileModule {}
