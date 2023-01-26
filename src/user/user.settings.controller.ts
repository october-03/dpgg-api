import { UserService } from './user.service';
import { Body, Controller, Delete } from '@nestjs/common';
import { registerUserDto } from 'src/dto/user.dto';

@Controller('user-settings')
export class UserSettingController {
  constructor(private readonly userService: UserService) {}

  //비밀번호 변경
}
