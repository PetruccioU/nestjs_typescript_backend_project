import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {Profile} from "../profile/profile.model";
import {Token} from "../token/token.model";
import {Files} from "../files/files.model";

// Добавим интерфейс для описания полей, нужных для создания объектов класса User
interface TextBlockAttrs{
    uniqueNameForSearch: string,
    name: string,
    image: string,
    text: string,
    group: string
}

// уникальное название для поиска (например, main-hero-text)
// название
// картинка
// текст
// ГРУППА - (например, main-page - чтобы все блоки главной страницы или другой группы фронтэнд мог получать одним запросом)

// Опишем модель того, как будем сохраняться в базе данных, текстовые блоки
@Table({tableName: 'text_block'})       // Пометим класс декоратором Table, чтобы класс стал таблицей в БД
export class TextBlock extends Model<TextBlock, TextBlockAttrs> { // Укажем как дженерик сам этот класс дженерики, и интерфейс UserCreationAttrs

    @ApiProperty({example: '1', description : 'Text block unique ident' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    id: number;

    @ApiProperty({example: 'main-hero-text', description : 'The unique title' })
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    uniqueNameForSearch: string;

    @ApiProperty({example: 'hero', description : 'Text title' })
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: '.jpg', description : 'Text block picture' })
    @Column({type: DataType.STRING, allowNull: true, defaultValue: null})
    image: string;

    @ApiProperty({example: 'Content', description : 'Text block content' })
    @Column({type: DataType.STRING, allowNull: true, defaultValue: null})
    text: string;

    @ApiProperty({example: 'main-page', description : 'Text block group' })
    @Column({type: DataType.STRING, allowNull: false,})
    group: string;



}

// @ApiProperty({example: 'Text block', description : 'entity where the file is used' })
// @Column({type: DataType.STRING, unique:false, allowNull: true})
// essenceTable: string;
//
// @ApiProperty({example: '1', description : 'ID of the entity where the file is used' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
// @Column({type: DataType.INTEGER, unique:true, allowNull: true})
// essenceId: number;

// @ApiProperty({example: '.jpg', description : 'Text block picture' })
// @ForeignKey(()=>File)   // Обозначим поле как внешний ключ, связанный запись text_block с записью из таблицы file
// @Column({type: DataType.INTEGER, unique:true, autoIncrement: true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
// fileId: number;

// @ApiProperty({example: 'For vulgar language', description : 'Reason' })
// @Column({type: DataType.STRING, allowNull: true})
// banReason: string;
//
// @ApiProperty({example: '1', description : 'Profile ident' })
// @ForeignKey(()=>Profile)   // Обозначим поле как внешний ключ, связанный запись user с записью из таблицы профилей
// @Column({type: DataType.INTEGER, unique:true, autoIncrement: true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
// profileId: number;
//
// // @BelongsTo(()=>Profile, ) // Создаём связь один к одному между таблицами Role и User, в БД через промежуточную таблицу UserRoles
// // profile: Profile[];
//
// //@OneToOne()
//
// @BelongsToMany(()=>Role, ()=> UserRoles) // Создаём связь многие ко многим между таблицами Role и User, в БД через промежуточную таблицу UserRoles
// roles: Role[];





