import { Team } from './../../team/entities/team.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column()
  position: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Team, (team) => team.members, {
    nullable: true,
  })
  team: Team;
}
