import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createTeamMemberDto } from 'src/dto/team.dto';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
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
      });
      if (team) {
        return team;
      }
      {
        throw new NotFoundException('Team not found');
      }
    } catch (err) {
      throw new NotFoundException('Team not found');
    }
  }

  async remove(id: string): Promise<void> {
    await this.teamRepository.delete(id);
  }

  async createTeam(team: createTeamMemberDto): Promise<Team> {
    return await this.teamRepository.save(team);
  }
}
