import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import * as process from "process";
import { PassportModule } from '@nestjs/passport';
//import { JwtStrategy } from './guard/jwt.strategy';

import {ProfileModule} from "../profile/profile.module";
import {TokenModule} from "../token/token.module";
import {MailService} from "./mail.service/mail.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Role} from "../roles/roles.model";
import {Profile} from "../profile/profile.model";
import {Token} from "../token/token.model";
import {MailModule} from "./mail.service/mail.module";
import {JwtAuthGuard} from "./guard/jwt.strategy";

// $ npm install --save @nestjs/passport passport passport-local
// $ npm install --save-dev @types/passport-local
// npm install passport-jwt

@Module({
  providers: [AuthService,   // Разрешим для использования в этом модуле свой собственный сервис, и сторонние отдельные сервисы
      JwtAuthGuard,
      //JwtStrategy,
      MailService,
      //JwtService
      ],
  controllers: [AuthController],    // Контроллеры этого модуля
  imports:[
      SequelizeModule.forFeature([User,Token,Role,Profile]), // Импортируем модели для работы с их репозиториями
      TokenModule,
      MailModule,
      ProfileModule,
      PassportModule,
      UsersModule,   // Импортируем весь UserModule, тк мы экспортировали из него его сервис, он будет доступен в authService
      JwtModule.register({     // Для jwt авторизации необходимо зарегистрировать JwtModule
        secret: process.env.PRIVATE_KEY || 'SECRET',  // Поле секретного ключа, которым будет подписан payload
        signOptions:{
          expiresIn: '24h'   // Укажем время жизни токена 24часа
        }
      })
  ],
  exports:[AuthService,JwtModule]
})
export class AuthModule {}


// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
// import { AuthController } from './auth.controller';
// import { UserModule } from '../user/user.module';
//
// @Module({
//     imports: [
//         UserModule,
//         PassportModule,
//         JwtModule.register({
//             secret: 'mysecretkey',
//             signOptions: { expiresIn: '60s' },
//         }),
//     ],
//     providers: [AuthService, JwtStrategy],
//     controllers: [AuthController],
//     exports: [AuthService],
// })
// export class AuthModule {}



