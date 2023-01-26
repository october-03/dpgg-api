import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUserDto } from 'src/dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface TokenPayload {
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  getJwt(email: string) {
    const payload: TokenPayload = { email };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  async register(req: registerUserDto) {
    const newUser: User = this.usersRepository.create({ ...req });
    await this.usersRepository.insert(newUser);
    return newUser;
  }

  async verifyPassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new HttpException(
        '인증 정보가 잘못되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAuthUser(email: string, password: string) {
    try {
      const user: User = await this.userService.findOne(email);
      await this.verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (err) {
      throw new HttpException(
        '인증 정보가 잘못되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
