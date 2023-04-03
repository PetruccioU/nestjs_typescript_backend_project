import { Module } from '@nestjs/common';
import {MailService} from "./mail.service";

@Module({
    providers: [MailService],   // сервисы которые мы будем использовать в этом модуле
    exports:[MailService]      // сервисы которые мы экспортируем из этого модуля
})
export class MailModule{}


