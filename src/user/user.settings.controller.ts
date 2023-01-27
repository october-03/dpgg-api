import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import JwtAuthGuard from './jwt-auth.guard';
import RequestUser from './requestUser.interface';
import { UserService } from './user.service';

@Controller('user-settings')
export class UserSettingController {
  constructor(private readonly userService: UserService) {}

  //비밀번호 변경
  @Patch('password')
  @UseGuards(JwtAuthGuard)
  updatePassword(@Req() req: RequestUser, @Body('password') password: string) {
    const { email } = req.user;
    return this.userService.updatePassword(email, password);
  }
}
