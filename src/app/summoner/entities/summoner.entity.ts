import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['name', 'region'], { unique: true })
export class Summoner {
  @PrimaryColumn()
  id: string;

  @Column()
  accountId: string;

  @Column()
  profileIconId: number;

  @Column({ type: 'float' })
  revisionDate: number;

  @Column()
  name: string;

  @Column()
  puuid: string;

  @Column()
  summonerLevel: number;

  @Column()
  region: string;
}
