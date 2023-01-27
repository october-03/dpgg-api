import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { registerUserDto } from 'src/dto/auth.dto';
import JwtAuthGuard from './jwt-auth.guard';
import RequestUser from './requestUser.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //계정 목록 조회
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //계정 상세 조회
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  //계정 삭제
  @Delete(':email')
  @UseGuards(JwtAuthGuard)
  remove(@Param('email') email: string) {
    return this.userService.remove(email);
  }

  //닉네임 변경
  @Patch()
  @UseGuards(JwtAuthGuard)
  updateNickName(@Body('nickname') nickname: string, @Req() req: RequestUser) {
    return this.userService.updateNickname(req.user.email, nickname);
  }
}
