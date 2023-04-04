import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import * as process from "process";
import { PassportModule } from '@nestjs/passport';
//import { JwtStrategy } from './guard/jwt.strategy';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ProfileModule} from "../profile/profile.module";
import {TokenModule} from "../token/token.module";
import {MailService} from "./mail.service/mail.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Role} from "../roles/roles.model";
import {Profile} from "../profile/profile.model";
import {Token} from "../token/token.model";
import {MailModule} from "./mail.service/mail.module";
import {JwtAuthGuard} from "./guard/jwt-auth.strategy";
import { JwtStrategy } from './guard/jwt.strategy';
import {AdminOrMyselfGuard} from "./guard/admin_or_myself.guard";

// $ npm install --save @nestjs/passport passport passport-local
// $ npm install --save-dev @types/passport-local
// npm install passport-jwt

@Module({
  providers: [AuthService,   // Разрешим для использования в этом модуле свой собственный сервис, и сторонние отдельные сервисы
      JwtAuthGuard,
      JwtStrategy,
      MailService,
      //JwtService,
      ConfigService,
      AdminOrMyselfGuard,
      ],
  controllers: [AuthController],    // Контроллеры этого модуля
  imports:[
      SequelizeModule.forFeature([User,Token,Role,Profile]), // Импортируем модели для работы с их репозиториями
      UsersModule,   // Импортируем весь UserModule, тк мы экспортировали из него его сервис, он будет доступен в authService
      TokenModule,
      MailModule,
      ProfileModule,
      PassportModule,
      JwtModule.register({     // Для jwt авторизации необходимо зарегистрировать JwtModule
        secret: process.env.JWT_SECRET || 'SECRET',  // Поле секретного ключа, которым будет подписан payload
        signOptions:{
          expiresIn: '24h'   // Укажем время жизни токена 24часа
        }
      })
  ],
  exports:[AuthService,JwtModule]
})
export class AuthModule {}
// providers: [AuthService, JwtStrategy],


