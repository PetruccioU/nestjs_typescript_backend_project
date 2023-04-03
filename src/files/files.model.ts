import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {Profile} from "../profile/profile.model";

// Добавим интерфейс для описания полей, нужных для создания объектов класса User
interface FilesCreationAttrs{
    filename : string,
    essenceTable: string,
    essenceId: number;

}

// 6.1. Сохранение файлов, в том числе в БД. среди прочего:
//
//     дата добавления createdAt
// сущность, где используется essenceTable
// id где используется essenceId

// Опишем модель того, как пользователь будет сохраняться в базе данных
@Table({tableName: 'file'})       // Пометим класс декоратором Table, чтобы класс стал таблицей в БД
export class Files extends Model<Files, FilesCreationAttrs> { // Укажем как дженерик сам этот класс дженерики, и интерфейс UserCreationAttrs

    @ApiProperty({example: '1', description : 'Unique ident' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    id: number;

    @ApiProperty({example: 'sdfsdgsd.jpg', description : 'Name of file' })
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    filename: string;

    @ApiProperty({example: 'Text block', description : 'Entity where the file is used' })
    @Column({type: DataType.STRING, unique:false, allowNull: true, defaultValue:null})
    essenceTable: string;

    @ApiProperty({example: '1', description : 'ID of the entity where the file is used' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
    @Column({type: DataType.INTEGER, unique:false, allowNull: true, defaultValue:null})
    essenceId: number;
}
//
// @ApiProperty({example: '1', description : 'Unique ident of the user' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
// @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
// ID_user: number;


// @ApiProperty({example: 'Text block', description : 'entity where the file is used' })
// @Column({type: DataType.STRING, unique:false, allowNull: true})
// essenceTable: string;
//
// @ApiProperty({example: '1', description : 'ID of the entity where the file is used' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
// @Column({type: DataType.INTEGER, unique:true, allowNull: true})
// essenceId: number;