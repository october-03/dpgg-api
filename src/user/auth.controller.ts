import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { registerUserDto } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './localAuth.guard';
import RequestUser from './requestUser.interface';

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

  //로그인
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestUser, @Res() Response) {
    const { user } = request;
    const cookie = this.authService.getJwt(user.email);
    Response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return Response.send(user);
  }

  //토큰 확인
  @UseGuards(LocalAuthGuard)
  @Get()
  authenticate(@Req() request: RequestUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
