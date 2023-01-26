import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserSettingController } from './user.settings.controller';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, UserSettingController, AuthController],
  providers: [UserService, AuthService, LocalStrategy],
  exports: [UserService, AuthService],
})
export class UserModule {}
