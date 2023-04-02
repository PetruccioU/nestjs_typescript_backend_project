import {forwardRef, Module} from '@nestjs/common';
import {FilesService} from "./files.service";
import { FilesController } from './files.controller';
import {TextBlockModule} from "../text_block/text_block.module";
import {TextBlockService} from "../text_block/text_block.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {TextBlock} from "../text_block/text_block.model";
import {Files} from "./files.model";

@Module({
    controllers: [FilesController],
    providers:[FilesService,TextBlockService],
    imports:[forwardRef(()=>TextBlockModule),
        SequelizeModule.forFeature([TextBlock, Files])
    ],
    exports:[FilesService]
})
export class FilesModule {
}
