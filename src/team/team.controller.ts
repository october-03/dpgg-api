import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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
    try {
      if (request.user.team) {
        throw { code: '5000' };
      }
      const requestData = {
        ...req,
        members: [request.user],
        leader: request.user.nickname,
      };
      return await this.teamService.createTeam(requestData);
    } catch (err) {
      switch (err.code) {
        case '5000':
          throw new HttpException('한 개의 팀만 참여 가능합니다.', 200);
        case '23503':
          throw new HttpException('한 개의 팀만 참여 가능합니다.', 200);
        default:
          throw new HttpException('알 수 없는 에러입니다.', 200);
      }
    }
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
    try {
      if (req.user.team) {
        throw { code: '5000' };
      }
      return await this.teamService.addMember(teamId, req.user);
    } catch (err) {
      switch (err.code) {
        case '5000':
          throw new HttpException('한 개의 팀만 참여 가능합니다.', 200);
        default:
          throw new HttpException('알 수 없는 에러입니다.', 200);
      }
    }
  }

  //팀 삭제
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteTeam(@Req() req: RequestUser) {
    try {
      if (!req.user.team) {
        throw { code: '5001' };
      }
      if (req.user.team.leader !== req.user.nickname) {
        throw { code: '5002' };
      }
      return await this.teamService.remove(req.user.team.key, req.user.email);
    } catch (err) {
      switch (err.code) {
        case '5001':
          throw new HttpException('팀에 참여하지 않았습니다.', 200);
        case '5002':
          throw new HttpException('팀장만 삭제할 수 있습니다.', 200);
        default:
          throw new HttpException('알 수 없는 에러입니다.', 200);
      }
    }
  }
}
