import {
  Body,
  Controller,
  HttpException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
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
    try {
      const { email } = req.user;
      if (password.length < 8 && password.length > 20) {
        throw { code: 4000 };
      }
      return this.userService.updatePassword(email, password);
    } catch (err) {
      switch (err.code) {
        case 4000:
          throw new HttpException(
            '비밀번호는 8자 이상 20자 이하로 설정해주세요.',
            200,
          );
        default:
          throw new HttpException('알 수 없는 에러입니다.', 200);
      }
    }
  }
}
