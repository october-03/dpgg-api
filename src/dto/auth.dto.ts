import { IsEnum, IsString } from 'class-validator';

type PositionType = 'adc' | 'spt' | 'mid' | 'jg' | 'top';

type ReadonlyRecord<P extends string = string, Q = P> = Readonly<Record<P, Q>>;

const DetailPositionType: ReadonlyRecord<PositionType> = {
  adc: 'adc',
  spt: 'spt',
  mid: 'mid',
  jg: 'jg',
  top: 'top',
};

export class registerUserDto {
  @IsString()
  readonly email: string;

  @IsEnum(DetailPositionType)
  readonly position: PositionType;

  @IsString()
  readonly password: string;
}
