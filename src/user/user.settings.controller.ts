import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user-settings')
export class UserSettingController {
  constructor(private readonly userService: UserService) {}

  //비밀번호 변경
}
