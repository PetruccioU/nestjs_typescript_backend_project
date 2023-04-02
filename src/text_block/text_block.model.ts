import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "./roles.model";
import {UserRoles} from "./user-roles.model";
import {Profile} from "../profile/profile.model";

// Добавим интерфейс для описания полей, нужных для создания объектов класса User
interface TextBlockAttrs{
    uniqueNameForSearch: string,
    name: string,
    picture: string,
    text: string,
    group: string
}

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
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    picture: string;

    @ApiProperty({example: 'Content', description : 'Text block content' })
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    text: string;

    @ApiProperty({example: 'main-page', description : 'Text block group' })
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    group: string;

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
}

// уникальное название для поиска (например, main-hero-text)
// название
// картинка
// текст
// ГРУППА - (например, main-page - чтобы все блоки главной страницы или другой группы фронтэнд мог получать одним запросом)

// Добавление, редактирование, удаление доступно только админу. 5.2.
// В получении списка среди прочего должна быть возможность фильтрации по группе

