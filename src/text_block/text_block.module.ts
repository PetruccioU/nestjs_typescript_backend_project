import {forwardRef, Module} from '@nestjs/common';
import { TextBlockController } from './text_block.controller';
import { TextBlockService } from './text_block.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TextBlock} from "./text_block.model";
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import {FilesService} from "../files/files.service";
import {FilesModule} from "../files/files.module";
import {Files} from "../files/files.model";

@Module({
  controllers: [TextBlockController],
  providers: [TextBlockService, FilesService],
  imports:[
      SequelizeModule.forFeature([TextBlock,Files]),
      forwardRef(()=>FilesModule)
  ],
    exports:[TextBlockService]
})
export class TextBlockModule {}
