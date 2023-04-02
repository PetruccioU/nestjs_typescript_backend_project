import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TextBlock} from "./text_block.model";
import {CreateTextBlockDto} from "./dto/create-text-block.dto";
import {UpdateTextBlockDto} from "./dto/update-text-block.dto";
import {where} from "sequelize";
import {FilesService} from "../files/files.service";
import {Files} from "../files/files.model";


@Injectable()
export class TextBlockService {
    constructor(@InjectModel(TextBlock) private textBlockRepository: typeof TextBlock,  // Введём модель TextBlock
                @InjectModel(Files) private filesRepository: typeof Files,
    private fileService: FilesService
    ) {}


    // CRUD операции:

    // POST
    async addTextBlock(dto: CreateTextBlockDto, image: any){
        const fileName = await this.fileService.createFile(image); // Делегируем методу createFile из сервиса файлов, сохраняем файл в статику. И возвращаем имя файла.
        const textblock = await this.textBlockRepository.create({...dto, image: fileName});  // Разворачиваем dto в объект textblock и записываем название файла-картинки.
        const fileInTable = await this.filesRepository.findOne({where:{filename:fileName}});   // В таблице файлов ищем запись по имени файла, который мы только что сохранили, чтобы взять её id.
        await this.filesRepository.update({essenceTable: 'text_block', essenceId:textblock.id},{where: { id: fileInTable.id }})  // В таблице файлов обновляем поля essenceTable, essenceId чтобы по ним иметь ассоциацию с записью в таблице текстовых блоков.
        return textblock
    }

    // GET
    async getAllTextBlock(){
        return await this.textBlockRepository.findAll({include: {all: true}})
    }

    async getTextBlockByUniqueName(uniqueName){
        return await this.textBlockRepository.findOne({ where: { uniqueNameForSearch: uniqueName.uniqueName } });
    }

    async getTextBlockByGroup(groupName){
        return await this.textBlockRepository.findAll({ where: { group: groupName.groupName } })
    }

    async getFileOFTextBlock(id){
        return await this.filesRepository.findOne({where:{essenceId:id.id}});
    }

    //PUT
    async updateTextBlock(id,dto){
        const textblock = await this.textBlockRepository.findOne({ where: { id: id } });
        await textblock.update({...dto});
        console.log(id,dto)
        return textblock;
    }


    // DELETE
    async deleteTextBlockByUniqueName(uniqueName){
        return await this.textBlockRepository.destroy({ where: { uniqueNameForSearch: uniqueName.uniqueName } });
    }


}
