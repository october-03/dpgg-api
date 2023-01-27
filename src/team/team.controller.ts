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
      leader: request.user.nickname,
    };
    return await this.teamService.createTeam(requestData);
  }

  //팀 리스트 조회
  @Get()
  async findAll() {
    return await this.teamService.findAll();
  }

  //팀 멤버 추가
  @Patch('add-member/:teamId')
  @UseGuards(JwtAuthGuard)
  async addMember(@Req() req: RequestUser, @Param('teamId') teamId: string) {
    return await this.teamService.addMember(teamId, req.user);
  }

  //팀 삭제
  @Delete('delete/:teamId')
  @UseGuards(JwtAuthGuard)
  async deleteTeam(@Req() req: RequestUser, @Param('teamId') teamId: string) {
    return await this.teamService.remove(teamId, req.user.email);
  }
}
