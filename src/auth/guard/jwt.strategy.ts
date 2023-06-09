import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends AuthGuard('jwt') {} // Передадим jwt стратегию из passport для регистрации в app.module.
