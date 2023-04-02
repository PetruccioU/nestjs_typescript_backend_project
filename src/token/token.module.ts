import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {JwtModule} from "@nestjs/jwt";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Role} from "../roles/roles.model";
import {Profile} from "../profile/profile.model";
import {Token} from "./token.model";

@Module({
  providers: [TokenService],   // сервисы которые мы будем использовать в этом модуле
  imports:[JwtModule, SequelizeModule.forFeature([Token, User])], // сторонние модули и SequelizeModule с моделями которые будут использованы в этом модуле
  exports:[TokenService]      // сервисы которые мы экспортируем из этого модуля
})
export class TokenModule{}
