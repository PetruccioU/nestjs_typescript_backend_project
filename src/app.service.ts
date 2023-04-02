import {Injectable} from "@nestjs/common";


@Injectable()
export class AppService{

    // Логику выносим в сервисы, контроллер лишь принимает и возвращает ответ
    getUsers(){
        return [{id:1, name: 'Vasia2'}]
    }
}

