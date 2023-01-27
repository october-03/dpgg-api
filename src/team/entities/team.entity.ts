import { User } from './../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  key: string;

  @Column()
  name: string;

  @Column()
  desc: string;

  @OneToMany(() => User, (user) => user.team, {
    nullable: true,
  })
  members: User[];

  @Column()
  type: string;

  @Column({ unique: true })
  leader: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
