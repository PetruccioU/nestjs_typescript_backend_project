import {Module} from "@nestjs/common";
// import {AppController} from "./app.controllers";
// import {AppService} from "./app.service";
import { UsersModule } from './users/users.module';
import {SequelizeModule} from "@nestjs/sequelize";
import * as process from "process";
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import { ProfileModule } from './profile/profile.module';
import {Profile} from "./profile/profile.model";
import { AuthModule } from './auth/auth.module';
import { TextBlockModule } from './text_block/text_block.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import * as path from "path";
import { APP_GUARD } from '@nestjs/core';
import {RolesGuard} from "./auth/guard/roles.guard";
import { TokenModule } from './token/token.module';
import {Token} from "./token/token.model";
import {TextBlock} from "./text_block/text_block.model";
import {Files} from "./files/files.model";
import {MailModule} from "./auth/mail.service/mail.module";
import {JwtService} from "@nestjs/jwt";

// Создадим и экспортируем модуль AppModule, пометим его декоратором @Module.
// @Module принимает в себя providers, controllers, imports, exports.
@Module({

    // Контроллеры, для создания эндпоинтов     // AppController
    controllers: [],

    // Провайдеры - переиспользуемые компоненты приложения, сервисы с логикой, имплементации паттернов.   //AppService.
    providers: [
        {
        provide: APP_GUARD,
        useClass: RolesGuard,
        },
        JwtService
    ],

    // Модули необходимые для работы приложения.
    imports: [
        // Установим cross-env, для запуска скриптов разработки и продакшена c параметрами.
        // npm i cross-env
        // Добавим изменения в скрипты:
        // "start": "nest start"  ->               "start": "cross-env NODE_ENV=production nest start"
        // "start:dev": "nest start --watch"  ->   "start:dev": "cross-env NODE_ENV=development nest start --watch"

        // Вынесем настройки БД в файл config, установив пакет конфигурации nestjs командой: npm i @nestjs/config.
        ConfigModule.forRoot({
            // Укажем путь до файла кофигурации:
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),

        // Импортируем и сконфигурируем модуль для работы со статикой.
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'client'),
        }),

        // Добавим в список импортов Sequelize - современную ORM для работы с TypeScript и Node.js.
        SequelizeModule.forRoot({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRESS_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRESS_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [User, Role, Profile, Token, TextBlock, Files], // Зарегистрируем модели для таблички пользователей, ролей и их связей.
        autoLoadModels: true
        }),

        // При создании модуля с пользователями автоматически добавился модуль UsersModule и другие.
        UsersModule,
        RolesModule,
        ProfileModule,
        AuthModule,
        TextBlockModule,
        FilesModule,
        MailModule,
        TokenModule,]
})
export class AppModule{}
