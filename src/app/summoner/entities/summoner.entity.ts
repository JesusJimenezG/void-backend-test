import { Participant } from '../../match/entities/match.entity';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['name', 'region', 'id'], { unique: true })
export class Summoner {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ unique: true })
  accountId: string;

  @Column()
  profileIconId: number;

  @Column({ type: 'float' })
  revisionDate: number;

  @Column()
  name: string;

  @Column({ unique: true })
  puuid: string;

  @Column()
  summonerLevel: number;

  @Column()
  region: string;

  @OneToMany(() => Participant, (participant) => participant.summoner)
  participants: Participant[];
}
