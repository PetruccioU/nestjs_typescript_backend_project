// класс будет возвращать простые объекты для хранения данных
import {ApiProperty} from "@nestjs/swagger";

export class UpdateRoleDto{

    @ApiProperty({example: '1', description : 'User with id: 1' })
    readonly userId: number;

    @ApiProperty({example: 'USER', description : 'Basic user role' })
    readonly value: string;
}