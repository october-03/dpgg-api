import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { registerUserDto } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './localAuth.guard';
import { Request } from 'express';
import { User } from './entities/user.entity';

interface RequestUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //계정 생성
  @Post('register')
  async register(@Body() req: registerUserDto) {
    const hashedPassword = await bcrypt.hash(req.password, 10);

    try {
      const createdUser = await this.authService.register({
        ...req,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (err) {
      switch (err.code) {
        case '23505':
          throw new HttpException(
            '이미 존재하는 이메일입니다.',
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(
            '알 수 없는 에러가 발생했습니다.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() req: RequestUser) {
    const user = req.user;
    user.password = undefined;
    return user;
  }
}
