import {Injectable} from '@nestjs/common';
import * as process from "process";
import {InjectModel} from "@nestjs/sequelize";
import {Token} from "./token.model";
import {User} from "../users/users.model";

const jwt = require('jsonwebtoken')


@Injectable()
export class TokenService {

    constructor(
        @InjectModel(Token) private tokenRepository: typeof Token, //
        @InjectModel(User) private userRepository: typeof User,
    ) {}

    // Сгенерируем токены.
    async generateTokens(payload){   // Payload - это информация, которая будет спрятана в токене.
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});      //  Создадим jwt подпись из payload с ключем из переменной окружения JWT_ACCESS_SECRET, это accessToken. Срок жизни токена: 30 минут
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});    //  Это refreshToken. Срок жизни токена: 30 дней
        console.log('Создана пара токенов');
        return {    // Возвращаем токены.
            accessToken,
            refreshToken
        }
    }

    // Обновим refreshToken в таблице token, или запишем его первый раз.
    async saveToken(user_Id, refreshToken){
        const tokenData = await this.tokenRepository.findOne({where:{ID_user: user_Id}});  // Ищем токен пользователя по его user_Id.
        if(tokenData){   // Если токен нашёлся, перезаписываем его.
            // tokenData.refreshToken = refreshToken;
            // await tokenData.save();
            await tokenData.update({refreshToken: refreshToken});  // Сохраняем новый refreshToken в БД.
            console.log(`Токен пользователя ${user_Id} обновлён.`)
        }else{
            console.log('Создан новый токен.')
            return await this.tokenRepository.create({refreshToken: refreshToken, ID_user: user_Id }); // Если токен не был найден, значит пользователь логинится первый раз, создадим для него запись с refreshToken.
        }
    }

    // Проверим accessToken.
    async validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;

        }catch (e){
            console.log(e);
            return null;
        }
    }

    // Проверим refreshToken.
    async validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;

        }catch (e){
            console.log(e);
            return null;
        }
    }

    // Поиск refreshToken'а.
    async findRefreshToken(refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({where:{refreshToken: refreshToken}}) // Находим токен в БД.
        console.log(`Токен найден`)
        return tokenData
    }

    // Удаление токена.
    async removeToken(refreshToken: string) {
        const tokenData = await this.tokenRepository.destroy({where:{refreshToken: refreshToken}}) // Удаляем токен из БД.
        console.log(`Токен пользователя удалён`)
        return tokenData
    }


}
