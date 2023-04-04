import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.strategy";     //from "../auth/guard/jwt.strategy";
import {FilesService} from "./files.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Request} from "express";
import {UpdateTextBlockDto} from "../text_block/dto/update-text-block.dto";

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService,
    ){}

    // POST
    @ApiOperation({summary: 'Upload a new file'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)       // Используемые гард.
    @Post('upload-file')
    @UseInterceptors(FileInterceptor('image'))
    uploadFiles(@UploadedFile()image){
        return this.filesService.createFile(image);
    }

    // GET
    @ApiOperation({summary: 'Get file by id'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)       // Используемые гард. getFile(@Param('id') id: number) @Req() req: Request
    @Get('/get-file/:id')
    getFile(@Req() req: Request){
        try {
            return this.filesService.getFile(+req.params.id);
        }
        catch (e) {
            console.log(e)
        }
    }

    //DELETE
    @ApiOperation({summary: 'Delete unused files'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)       // Используемые гард.
    @Delete('delete-unused-files')
    deleteUnusedFiles(){
        return this.filesService.deleteUnusedFiles();
    }

    @ApiOperation({summary: 'Delete one file'})  // Декоратор для swagger.
    @ApiResponse({status: 200})
    //@UseGuards(JwtAuthGuard)       // Используемые гард.
    @Delete('delete-file')
    deleteFile(@Body() body: { fileName: string}){
        const { fileName } = body;
        return this.filesService.deleteFile(fileName);
    }
}

