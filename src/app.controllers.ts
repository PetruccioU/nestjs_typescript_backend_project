// import {Controller, Get} from "@nestjs/common";
// import {AppService} from "./app.service";
//
// // Создадим и экспортируем отсюда класс AppController, пометив его декоратором @Controller(из @nestjs/common).
// // Создавать роутеры как в express не надо
// @Controller('/api') // Декоратор принимает префикс по которому будет отрабатывать контроллер
// export class AppController {
//
//     // применим метод dependency injection: Добавляем класс AppService в конструктор и используем его без создания его объектов
//     constructor( private appService : AppService) {
//     }
//
//     // Первый метод возвращает пользователей
//     @Get('/users')   // Чтобы сделать функцию эндпоинтом, пометим её декоратором соответствующего HTTP запроса, добавляем путь
//     getUsers(){
//         return this.appService.getUsers()   // Делегировали логику методу getUsers из AppService
//     }
//
// }








