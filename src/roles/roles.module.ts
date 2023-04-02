import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {User} from "../users/users.model";

import {Profile} from "../profile/profile.model";
import {FilesService} from "../files/files.service";

@Module({
  providers: [RolesService], // Сервисы которые мы будем использовать в этом модуле
  controllers: [RolesController],
  imports: [SequelizeModule.forFeature([Role, User, Profile])],
  exports: [RolesService]
})
export class RolesModule {}



