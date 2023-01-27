import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { createTeamDto } from 'src/dto/team.dto';
import JwtAuthGuard from 'src/user/jwt-auth.guard';
import RequestUser from 'src/user/requestUser.interface';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  //팀 생성
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createTeam(@Body() req: createTeamDto, @Req() request: RequestUser) {
    const requestData = {
      ...req,
      members: [request.user],
    };
    return await this.teamService.createTeam(requestData);
  }

  //팀 리스트 조회
  @Get()
  async findAll() {
    return await this.teamService.findAll();
  }
}
