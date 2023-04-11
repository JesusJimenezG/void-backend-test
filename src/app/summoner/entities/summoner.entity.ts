import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Summoner {
  @PrimaryGeneratedColumn()
  voidId: number;

  @Column()
  accountId: string;

  @Column()
  profileIconId: number;

  @Column()
  revisionDate: number;

  @Column()
  name: string;

  @Column()
  id: string;

  @Column()
  puuid: string;

  @Column()
  summonerLevel: number;

  @Column()
  region: string;
}
