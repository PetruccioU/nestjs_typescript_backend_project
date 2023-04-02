// Установим seqilized
// npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
// npm install --save pg pg-hstore
// npm install --save-dev @types/sequelize

import {Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

// Добавим интерфейс для описания полей, нужных для создания объектов класса User
interface UserCreationAttrs{
    email:string,
    password:string,
}


// Опишем модель того, как пользователь будет сохраняться в базе данных
@Table({tableName: 'users'})       // Пометим класс декоратором Table, чтобы класс стал таблицей в БД
export class User extends Model<User, UserCreationAttrs> { // Укажем как дженерик сам этот класс дженерики,

    @ApiProperty({example: '1', description : 'Unique ident' })
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    id: number;

    @ApiProperty({example: 'user@gmail.com', description : 'Unique email' })
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    email: string;

    @ApiProperty({example: '123qwe', description : 'Users password' })
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'true', description : 'Is user banned?' })
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'For vulgar language', description : 'Reason' })
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;
}
