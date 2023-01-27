import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUserDto } from 'src/dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const userList = await this.usersRepository.find({
      relations: ['team'],
    });
    // const mappingNickname = userList.map((user) => user.nickname);
    return userList;
  }

  async findOne(email: string): Promise<User> {
    try {
      const user: User = await this.usersRepository.findOne({
        where: { email: email },
        relations: ['team'],
      });
      if (user) {
        return user;
      }
      {
        throw new NotFoundException('User not found');
      }
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  }

  async remove(email: string): Promise<void> {
    await this.usersRepository.delete(email);
  }

  async updateNickname(email: string, nickname: string): Promise<User> {
    const targetUser: User = await this.findOne(email);
    targetUser.nickname = nickname;
    return await this.usersRepository.save(targetUser);
  }

  async updatePassword(email: string, password: string): Promise<User> {
    const targetUser: User = await this.findOne(email);
    targetUser.password = password;
    return await this.usersRepository.save(targetUser);
  }
}
