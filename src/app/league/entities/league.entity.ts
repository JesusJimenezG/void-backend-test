import { Summoner } from '../../summoner/entities/summoner.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class League {
  @PrimaryColumn()
  leagueId: string;

  @ManyToOne(() => Summoner)
  @JoinColumn({ name: 'summonerId', referencedColumnName: 'id' })
  summoner: Summoner;

  @Column()
  queueType: string;

  @Column()
  tier: string;

  @Column()
  rank: string;

  @Column()
  leaguePoints: number;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @Column()
  hotStreak: boolean;

  @Column()
  veteran: boolean;

  @Column()
  freshBlood: boolean;

  @Column()
  inactive: boolean;

  @Column()
  region: string;
}

// @Column()
// summonerName: string;

// @ManyToOne(() => Summoner, (summoner) => summoner.id)
// summonerId: string;
