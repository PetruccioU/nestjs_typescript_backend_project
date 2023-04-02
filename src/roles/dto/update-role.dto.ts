// класс будет возвращать простые объекты для хранения данных
import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto{

    @ApiProperty({example: 'USER', description : 'Basic user role' })
    readonly value: string;

    @ApiProperty({example: 'Default users role', description : 'Role description' })
    readonly description: string;
}