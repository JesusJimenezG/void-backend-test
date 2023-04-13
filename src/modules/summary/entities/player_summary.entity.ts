import { League } from 'src/modules/league/entities/league.entity';
import { Summoner } from 'src/modules/summoner/entities/summoner.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PlayerSummary {
  @PrimaryGeneratedColumn('uuid')
  playerId: string;

  @OneToOne(() => Summoner)
  @JoinColumn({ referencedColumnName: 'id' })
  summoner: Summoner;

  @OneToMany(() => League, (league) => league.player, {
    cascade: true,
    eager: true,
  })
  leagues: League[];

  @Column()
  region: string;
}
