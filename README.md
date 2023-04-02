ДЗ:
1. Оставшиеся главы с 1-14 учебника https://learn.javascript.ru/ с выкладыванием результатов на git.
2. Создать проект nestJs + Typescript. ОК
3. Создать необходимый код для авторизации и работы с ролями. 
   ВАЖНО
   покройте максимально код комментариями, чтобы вам всегда легко было к нему вернуться. Потому что, тема для неопытного разработчика часто забывается.  ОК


4. Создать код для работы с профилем.
   ВАЖНО
   создаем отдельные таблицы
   user (для авторизации - логин/mail, пароль и пр.) и profile для профиля (фамилия, телефон, и пр - полный перечень полей на ваше усмотрение).
- Связь у таблиц 1 к 1.  ОК


- У нас должен быть эндпоинт для регистрации (поучает и пароль и ФИО и телефон и пр). Его будет обрабатывать код, относящийся к профайлу. Код профайла будет обращаться к коду авторизации, получать ID_user и использовать его для создания профиля.
Благодаря этому код авторизации будет неизменным полностью, какие бы данные в профиле не были. И проще использовать в других проектах. Особенно ценно станет при переходе к микросервисам.

4.1. Для удаления и редактирования поставить проверку прав. Только себя или админ.


5. Создать модуль "текстовый блок".
   [
   Для чего используется на практике:
   У вас на главной странице сайта есть текст-приветствие. А еще есть блок из трех преимуществ (У каждого картинка, текст, заголовок). Еще какой-то блок с текущей акцией и пр.
   Фронтэндер может все эти тексты вшить в код, но лучше, чтобы админ мог это редактировать.
   ]
   Таким образом необходимы CRUD-методы для управления такими блоками
- уникальное название для поиска (например, main-hero-text)
- название
- картинка
- текст
- ГРУППА - (например, main-page - чтобы все блоки главной страницы или другой группы фронтэнд мог получать одним запросом)
  5.1. Добавление, редактирование, удаление доступно только админу.
  5.2. В получении списка среди прочего должна быть возможность фильтрации по группе


6. Написать отдельный модуль по сохранению файлов
   [
   Для чего используется на практике:
   Пользователь заполняет форму фильму создания фильма.
   К фильму добавляется 5 скриншотов.
   Эти скриншоты пользователь добавляет еще до нажатия кнопки сохранить.
   Но при этом мы ему сразу хотим отобразить превью этих скриншотов.
   ]

6.1. Сохранение файлов, в том числе в БД.
   среди прочего:
- дата добавления createdAt
- сущность, где используется essenceTable
- id где используется essenceId

6.2. Добавить эндпоинт по которому можно удалить все лишние файлы
- прошло больше часа с момента создания
- нигде не используется (essenceId/essenceTable пустые)
  essenceTable + essenceId могут быть, например, такие: profile 17, profile 19, film 23, film 17 (одновременно только одна пара значений само собой записана или null)

6.3. сделать п.7.


7. Сделать возможность использовать файловый модуль в п.5
   Файл приходит вместе с остальными данными. Получается модуль текстового блока должен вызвать в том числе сохранение файла из модуля 6. Цель - вся работа с файлами должна быть сосредоточена в одном месте.
   Обращаем внимание, что при редактировании файл - не обязательное поле.
   Обращаем внимание, что  удалении блока файл перестает использоваться






<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
