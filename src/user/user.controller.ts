import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { registerUserDto } from 'src/dto/auth.dto';
import JwtAuthGuard from './jwt-auth.guard';

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
  @Patch(':email')
  @UseGuards(JwtAuthGuard)
  updateNickName(
    @Param('email') email: string,
    @Body('nickname') nickname: string,
  ) {
    return this.userService.updateNickname(email, nickname);
  }
}
