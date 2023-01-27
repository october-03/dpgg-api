import { IsArray, IsEnum, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

type matchType = 'solo' | '5x5';

type ReadonlyRecord<P extends string = string, Q = P> = Readonly<Record<P, Q>>;

const DetailMatchType: ReadonlyRecord<matchType> = {
  solo: 'solo',
  '5x5': '5x5',
};

export class createTeamDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly desc: string;

  @IsEnum(DetailMatchType)
  readonly type: matchType;
}

export class createTeamMemberDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly desc: string;

  @IsEnum(DetailMatchType)
  readonly type: matchType;

  @IsArray()
  readonly members: User[];
}
