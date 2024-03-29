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
  Param,
} from '@nestjs/common';
import { registerUserDto } from 'src/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from './localAuth.guard';
import RequestUser from './requestUser.interface';
import JwtAuthGuard from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //계정 생성
  @Post('register')
  async register(@Body() req: registerUserDto) {
    const hashedPassword = await bcrypt.hash(req.password, 10);

    try {
      if (req.password.length < 8 && req.password.length > 20) {
        throw { code: 4000 };
      }
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
        case 4000:
          throw new HttpException(
            '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
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
  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() request: RequestUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  //로그아웃
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() request: RequestUser, @Res() Response) {
    Response.setHeader('Set-Cookie', this.authService.getLogoutHeader());
    return Response.sendStatus(200);
  }

  //비밀번호 일치 확인
  @UseGuards(JwtAuthGuard)
  @Get('verify-password/:password')
  async verifyPassword(
    @Req() request: RequestUser,
    @Param('password') password: string,
  ) {
    const user = request.user;
    await this.authService.verifyPassword(password, user.password);
    throw new HttpException('비밀번호가 일치합니다.', HttpStatus.OK);
  }
}
