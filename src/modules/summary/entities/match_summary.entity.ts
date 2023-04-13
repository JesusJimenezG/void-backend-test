import {
  MatchInfo,
  Participant,
} from 'src/modules/match/entities/match.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MatchSummary {
  @PrimaryGeneratedColumn('uuid')
  matchSummaryId: string;

  @OneToOne(() => MatchInfo)
  @JoinColumn({ referencedColumnName: 'matchId' })
  matchInfo: MatchInfo;

  @OneToOne(() => Participant)
  @JoinColumn({ referencedColumnName: 'uuid' })
  participant: Participant;

  @Column()
  region: string;
}
