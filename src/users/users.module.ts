import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {Profile} from "../profile/profile.model";
import {RolesModule} from "../roles/roles.module";
import {ProfileModule} from "../profile/profile.module";
import {Token} from "../token/token.model";
import {TokenModule} from "../token/token.module";
import {TokenService} from "../token/token.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService,TokenService],
  imports:[
      SequelizeModule.forFeature([User, Role, Profile, Token]),  // Добавим модели массивом
      RolesModule,  // Импортируем в модуль пользователя RolesModule, заранее ЭКСПОРТИРОВАВ из него СЕРВИС, чтобы использовать RolesModule(вместе с его сервисом) в сервисе User
      ProfileModule,  // Также импортируем ProfileModule
      TokenModule,
  ],
  exports:[UsersService]
})
export class UsersModule {}
