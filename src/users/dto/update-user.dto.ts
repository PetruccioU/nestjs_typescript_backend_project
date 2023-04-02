// класс будет возвращать простые объекты для хранения данных
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto{

    @ApiProperty({example: 'user@gmail.com', description : 'Unique email' })
    readonly email: string;

    @ApiProperty({example: '123qwe', description : 'Users password' })
    readonly password: string;
}


