// Файл main.ts будет точкой входа в наше приложение
// Запустим скрипт start:dev для удобства разработки
// npm run start:dev

// Импортируем модуль AppModule
import {AppModule} from "./app.module";

// Импортируем модуль NestFactory
import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";  // NestJS Основан на декораторах.
import { RolesService } from './roles/roles.service';
import {UsersService} from "./users/users.service";
import * as cookieParser from 'cookie-parser';
//import * as nodemailer from 'nodemailer'

// Создаем асинхронную функцию start, она будет запускать приложение.
async function start(){
    const PORT = process.env.PORT || 8000; // Возьмем номер порта из окружения либо присвоим ему значение 5000.
    const app = await NestFactory.create(AppModule); // Будем создавать экземпляры нашего приложения.

    // Подключим мидлвэйр cookie-parser.
    app.use(cookieParser());

    //app.use(nodemailer());

    // Создадим изначальные роли и администратора, сервисы ролей и пользователей.
    const rolesService = app.get(RolesService);
    const userService = app.get(UsersService);
    async function bootstrap() {
        await Promise.all([
            rolesService.createUserRoleInitial(),
            rolesService.createAdminRoleInitial()
        ]);
        await userService.createAdminUser();
    }
    await bootstrap();

    // Создадим переменную для настройки swagger:
    const config = new DocumentBuilder() // DocumentBuilder это паттерн, позволяющий добавлять объекту поля.
        .setTitle('Backend log')
        .setDescription('REST API documentation')
        .setVersion('1.0.0')
        .addTag('nestjs')
        .build()

    // Создадим объект документации:
    const document = SwaggerModule.createDocument(app, config); // передаём инстанс нашего приложения и конфиг.
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`)); // Прослушаем выбранный порт.
}

// Вызовем функцию, запустим приложение.
start()







