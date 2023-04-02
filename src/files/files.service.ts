import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'
import {InjectModel} from "@nestjs/sequelize";
import {TextBlock} from "../text_block/text_block.model";
import {Files} from "./files.model";

@Injectable()
export class FilesService {

    constructor(@InjectModel(Files) private filesRepository: typeof Files) {}

    // Создать файл.
    async createFile(file): Promise<string> {
        try {                                                   // Оборачиваем все в модуль try/catch так как при записи файла могут произойти ошибки.
            const fileName = uuid.v4() + '.jpg';                           // Генерируем случайное имя для файла и прибавляем ему разрешение .jpg.
            const filePath = path.resolve(__dirname, '..', 'static');           // Файлы будем хранить в папке static.
            try {
                await fs.promises.access(filePath, fs.constants.F_OK);            // Проверяем, если по такому пути ничего не существует.
            } catch (err) {
                await fs.promises.mkdir(filePath, { recursive: true });        // Если нет, рекурсивно создаём папки для переданного пути.
            }
            await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);      // Когда папка создана, записываем туда файл, вторым параметрам передаем буфер взятый из файла.
            await this.filesRepository.create({ filename: fileName });          // Создаём запись в таблице файлов.
            console.log('Загружен файл');
            return fileName;                                                     // Возвращаем файл
        } catch (err) {
            console.log(err);
            throw new HttpException('При записи файла произошла ошибка.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Получить файл.
    async getFile(id: number): Promise<Buffer> {
        try {
            const fileInTable = await this.filesRepository.findOne({where:{id:id}});
            //const fileInTable = await this.filesRepository.findByPk(id)
            const fileName = fileInTable.filename;
            const filePath = path.join(__dirname, '..', 'static', fileName);
            try {
                await fs.promises.stat(filePath); // Проверяем существует ли файл.
            } catch (e) {
                new HttpException('Файл не найден', HttpStatus.NOT_FOUND);
            }
            const file = await fs.promises.readFile(filePath);
            console.log('Файл передан на клиент');
            return file;
        } catch (e) {
            console.log(e);
            throw new HttpException('Ошибка при передаче файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Удаляем неиспользуемые файлы.
    async deleteUnusedFiles() {
        const files = await this.filesRepository.findAll(); // Выберем все записи.
        for (const file of files){     // Пройдемся по ним в цикле.
            //console.log(file.dataValues.createdAt, file.dataValues.essenceTable);
            //console.log((Date.now() - new Date(file.createdAt).getTime())/60000)
            const timeElapsed = Date.now() - new Date(file.createdAt).getTime(); // Вычислим сколько времени существует запись относящаяся к статическому файлу.
            if((file.essenceTable === null) && (timeElapsed > 60*60*1000)){     // Если файл создан больше часа назад и не ассоциирован ни с одной таблицей, он нам не нужен - удаляем.
                await this.deleteFile(file.filename);      // Вызываем метод удаления.
                console.log('Ненужные файлы удалены');
            }
        }
    }

    // Удаление файла по его имени.
    async deleteFile(fileName: string): Promise<void> {
        try {
            const filePath = path.join(__dirname, '..', 'static', fileName); // Берём путь до файла.
            try {
                await fs.promises.stat(filePath); // Проверяем существует ли файл.
            } catch (e) {
                new HttpException('Файл не найден.', HttpStatus.NOT_FOUND);  // Если нет, бросаем исключение.
            }
            await fs.promises.unlink(filePath);  // Удаляем файл.
            await this.filesRepository.destroy({where:{filename: fileName}}); // Удалим запись о файле из таблицы.
            console.log('Файл удален.');
        } catch (e) {
            throw new HttpException('При удалении файла произошла ошибка.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


// Пока реализуем на синхронных функциях
// async createFile(file): Promise<string> {    // Запишем строку в качестве названия файла.
//     try {    // Оборачиваем все в модуль try/catch так как при записи файла могут произойти ошибки
//         const fileName = uuid.v4()+ '.jpg';     // Генерируем случайное имя для файла и прибавляем ему разрешение .jpg
//         const filePath = path.resolve(__dirname, '..', 'static') // Файлы будем хранить в папке static
//         if (!fs.existsSync(filePath)) {    // Проверяем, если по такому пути ничего не существует,
//             fs.mkdirSync(filePath,{recursive:true})     // Рекурсивно создаём папки для переданного пути
//         }
//         fs.writeFileSync(path.join(filePath, fileName), file.buffer) // Когда папка создана, записываем туда файл, вторым параметрам передаем буфер взятый из файла
//         await this.filesRepository.create({filename:fileName})
//         console.log('Загружен файл');
//         return fileName;      // Возвращаем файл
//     } catch (e){console.log(e);
//         throw new HttpException('При записи файла произошла ошибка', HttpStatus.INTERNAL_SERVER_ERROR)}
// }

// В текстовом блоке мы ссылаемся на таблицу с файлами 1 к 1. Но это поле можно и не делать совсем, если в таблице файлов искать по essenceId и
// essenceTable. можно и так и эдак


// 6. Написать отдельный модуль по сохранению файлов [ Для чего используется на практике: Пользователь заполняет форму фильму
// создания фильма. К фильму добавляется 5 скриншотов. Эти скриншоты пользователь добавляет еще до нажатия кнопки
// сохранить. Но при этом мы ему сразу хотим отобразить превью этих скриншотов. ]
// 6.1. Сохранение файлов, в том числе в БД. среди прочего:
//
//     дата добавления createdAt
// сущность, где используется essenceTable
// id где используется essenceId
// 6.2. Добавить эндпоинт по которому можно удалить все лишние файлы
//
// прошло больше часа с момента создания
// нигде не используется (essenceId/essenceTable пустые) essenceTable + essenceId могут быть, например, такие: profile 17,
//     profile 19, film 23, film 17 (одновременно только одна пара значений само собой записана или null)



