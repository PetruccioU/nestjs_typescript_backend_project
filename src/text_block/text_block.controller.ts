import {Body, Controller, Delete, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TextBlockService} from "./text_block.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {RolesGuard} from "../auth/guard/roles.guard";
import {Roles} from "../auth/guard/roles.decorator";
import {UpdateTextBlockDto} from "./dto/update-text-block.dto";

//  Таким образом необходимы CRUD-методы для управления такими блоками
// Добавление, редактирование, удаление доступно только админу. 5.2.
// В получении списка среди прочего должна быть возможность фильтрации по группе

@ApiTags('Text block')  // Контроллер пометим анотацией ApiTags
@Controller('text-block')
export class TextBlockController {
    constructor(private textBlockService: TextBlockService  // Вводим сервис, как приватное поле класса.
    ){}

    // Создадим эндпоинты для CRUD операций:
    // POST
    @ApiOperation({summary: 'Add text block'})
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)
    @Post('add-text-block')
    @UseInterceptors(FileInterceptor('image'))
    addTextBlock(@Body() dto,
                 @UploadedFile() image){
        return this.textBlockService.addTextBlock(dto,image);
    }

    // GET
    @ApiOperation({summary: 'Get all text blocks'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)       // Используемые гард.
    @Get('get-all')
    getAllTextBlock(){
        return this.textBlockService.getAllTextBlock();
    }

    @ApiOperation({summary: 'Get one text block by unique name'})
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)
    @Get('get-by-unique-name')
    getTextBlockByUniqueName(@Body() uniqueName: string){
        return this.textBlockService.getTextBlockByUniqueName(uniqueName);
    }

    @ApiOperation({summary: 'Get text blocks by group name'})
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)
    @Get('get-by-group-name')
    getTextBlockByGroupName(@Body() groupName: string){
        return this.textBlockService.getTextBlockByGroup(groupName);
    }

    @ApiOperation({summary: 'Get text blocks by group name'})
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)
    @Get('get-text_block_file')
    getTextBlockFile(@Body() id){
        return this.textBlockService.getFileOFTextBlock(id);
    }

    // PUT
    @ApiOperation({summary: 'update text block'})
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)
    @Put('update')
    updateTextBlock(@Body() body: { id: number, dto: UpdateTextBlockDto }){
        const { id, dto } = body;                                        // Деструктурируем тело запроса на переменные.
        return this.textBlockService.updateTextBlock(id,dto);
    }

    // DELETE
    @ApiOperation({summary: 'Delete text block'})
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)
    @Delete('delete-by-unique-name')
    deleteTextBlockByUniqueName(@Body() uniqueName: string){
        return this.textBlockService.deleteTextBlockByUniqueName(uniqueName);
    }






}
