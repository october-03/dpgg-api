import { UserService } from './../user/user.service';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createTeamMemberDto } from 'src/dto/team.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async findAll(): Promise<Team[]> {
    const teamList = await this.teamRepository.find({
      relations: ['members'],
    });
    return teamList;
  }

  async findOne(id: string): Promise<Team> {
    try {
      const team: Team = await this.teamRepository.findOne({
        where: { key: id },
        relations: ['members'],
      });
      if (team) {
        return team;
      }
      {
        throw new NotFoundException('팀을 찾을 수 없습니다.');
      }
    } catch (err) {
      throw new HttpException('잘못된 요청입니다.', 400);
    }
  }

  async findTeamWithLeader(nickname: string): Promise<Team> {
    try {
      const team: Team = await this.teamRepository.findOne({
        where: { leader: nickname },
        relations: ['members'],
      });
      if (team) {
        return team;
      }
      {
        throw new NotFoundException('팀을 찾을 수 없습니다.');
      }
    } catch (err) {
      throw new HttpException('잘못된 요청입니다.', 400);
    }
  }

  async remove(id: string, email: string): Promise<void> {
    await this.userService.removeTeam(email);
    await this.teamRepository.delete(id);
  }

  async createTeam(team: createTeamMemberDto): Promise<Team> {
    return await this.teamRepository.save(team);
  }

  async addMember(id: string, member: User): Promise<Team> {
    const targetTeam: Team = await this.findOne(id);
    const positionList = targetTeam.members.map((member) => member.position);
    const nicknameList = targetTeam.members.map((member) => member.nickname);
    if (positionList.includes(member.position)) {
      throw new HttpException('이미 존재하는 포지션입니다.', 200);
    }
    if (nicknameList.includes(member.nickname)) {
      throw new HttpException('이미 참가되었습니다.', 200);
    }
    if (
      (targetTeam.type === 'solo' && targetTeam.members.length === 2) ||
      (targetTeam.type === '5x5' && targetTeam.members.length === 5)
    ) {
      throw new HttpException('팀 정원이 초과되었습니다.', 200);
    }
    targetTeam.members.push(member);
    console.log(targetTeam);
    return await this.teamRepository.save(targetTeam);
  }
}
