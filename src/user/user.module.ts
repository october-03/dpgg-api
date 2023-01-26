import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserSettingController } from './user.settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, UserSettingController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
