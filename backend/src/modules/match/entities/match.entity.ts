import { Summoner } from '../../summoner/entities/summoner.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MatchMetadata {
  @PrimaryColumn({ unique: true })
  matchId: string;

  @Column('text', { array: true })
  participants: string[];
}

@Entity()
export class MatchInfo {
  @PrimaryColumn({ unique: true })
  matchId: string;

  @Column({ default: 0 })
  queueId: number;

  @Column('bigint', { default: 0 })
  gameCreation: number;

  @Column({ default: 0 })
  gameDuration: number;

  @Column()
  gameMode: string;

  @Column()
  gameName: string;

  @Column()
  gameType: string;

  @OneToMany(() => Participant, (participant) => participant.matchInfo, {
    cascade: true,
    eager: true,
  })
  participants: Participant[];
}

@Entity()
export class Match {
  @PrimaryColumn({ unique: true })
  matchId: string;

  @OneToOne(() => MatchMetadata, { cascade: true, eager: true })
  @JoinColumn()
  metadata: MatchMetadata;

  @OneToOne(() => MatchInfo, { cascade: true, eager: true })
  @JoinColumn()
  info: MatchInfo;

  @Column()
  region: string;
}

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  challengeId: string;

  @Column({ default: 0 })
  '12AssistStreakCount': number;

  @Column({ default: 0 })
  abilityUses: number;

  @Column({ default: 0 })
  acesBefore15Minutes: number;

  @Column('float8', { default: 0 })
  alliedJungleMonsterKills: number;

  @Column({ default: 0 })
  baronTakedowns: number;

  @Column({ default: 0 })
  blastConeOppositeOpponentCount: number;

  @Column({ default: 0 })
  bountyGold: number;

  @Column({ default: 0 })
  buffsStolen: number;

  @Column({ default: 0 })
  completeSupportQuestInTime: number;

  @Column('decimal', { default: 0 })
  controlWardTimeCoverageInRiverOrEnemyHalf: number;

  @Column('decimal', { default: 0 })
  damagePerMinute: number;

  @Column('decimal', { default: 0 })
  damageTakenOnTeamPercentage: number;

  @Column('decimal', { default: 0 })
  earliestDragonTakedown: number;

  @Column('decimal', { default: 0 })
  effectiveHealAndShielding: number;

  @Column('decimal', { default: 0 })
  gameLength: number;

  @Column('decimal', { default: 0 })
  goldPerMinute: number;

  @Column('float8', { default: 0 })
  jungleCsBefore10Minutes: number;

  @Column('decimal', { default: 0 })
  kda: number;

  @Column('decimal', { default: 0 })
  killParticipation: number;

  @Column('decimal', { default: 0 })
  maxCsAdvantageOnLaneOpponent: number;

  @Column('decimal', { default: 0 })
  moreEnemyJungleThanOpponent: number;

  @Column('decimal', { default: 0 })
  teamDamagePercentage: number;

  @Column('decimal', { default: 0 })
  visionScoreAdvantageLaneOpponent: number;

  @Column('decimal', { default: 0 })
  visionScorePerMinute: number;

  @Column({ default: 0 })
  controlWardsPlaced: number;

  @Column({ default: 0 })
  dancedWithRiftHerald: number;

  @Column({ default: 0 })
  deathsByEnemyChamps: number;

  @Column({ default: 0 })
  dodgeSkillShotsSmallWindow: number;

  @Column({ default: 0 })
  doubleAces: number;

  @Column({ default: 0 })
  dragonTakedowns: number;

  @Column({ default: 0 })
  earlyLaningPhaseGoldExpAdvantage: number;

  @Column({ default: 0 })
  elderDragonKillsWithOpposingSoul: number;

  @Column({ default: 0 })
  elderDragonMultikills: number;

  @Column({ default: 0 })
  enemyChampionImmobilizations: number;

  @Column('float8', { default: 0 })
  enemyJungleMonsterKills: number;

  @Column({ default: 0 })
  epicMonsterKillsNearEnemyJungler: number;

  @Column({ default: 0 })
  epicMonsterKillsWithin30SecondsOfSpawn: number;

  @Column({ default: 0 })
  epicMonsterSteals: number;

  @Column({ default: 0 })
  epicMonsterStolenWithoutSmite: number;

  @Column({ default: 0 })
  flawlessAces: number;

  @Column({ default: 0 })
  fullTeamTakedown: number;

  @Column({ default: 0 })
  getTakedownsInAllLanesEarlyJungleAsLaner: number;

  @Column({ default: 0 })
  hadOpenNexus: number;

  @Column({ default: 0 })
  immobilizeAndKillWithAlly: number;

  @Column({ default: 0 })
  initialBuffCount: number;

  @Column({ default: 0 })
  initialCrabCount: number;

  @Column({ default: 0 })
  junglerTakedownsNearDamagedEpicMonster: number;

  @Column({ default: 0 })
  kTurretsDestroyedBeforePlatesFall: number;

  @Column({ default: 0 })
  killAfterHiddenWithAlly: number;

  @Column({ default: 0 })
  killedChampTookFullTeamDamageSurvived: number;

  @Column({ default: 0 })
  killingSprees: number;

  @Column({ default: 0 })
  killsNearEnemyTurret: number;

  @Column({ default: 0 })
  killsOnOtherLanesEarlyJungleAsLaner: number;

  @Column({ default: 0 })
  killsOnRecentlyHealedByAramPack: number;

  @Column({ default: 0 })
  killsUnderOwnTurret: number;

  @Column({ default: 0 })
  killsWithHelpFromEpicMonster: number;

  @Column({ default: 0 })
  knockEnemyIntoTeamAndKill: number;

  @Column({ default: 0 })
  landSkillShotsEarlyGame: number;

  @Column({ default: 0 })
  laneMinionsFirst10Minutes: number;

  @Column({ default: 0 })
  laningPhaseGoldExpAdvantage: number;

  @Column({ default: 0 })
  legendaryCount: number;

  @Column({ default: 0 })
  lostAnInhibitor: number;

  @Column({ default: 0 })
  maxKillDeficit: number;

  @Column({ default: 0 })
  maxLevelLeadLaneOpponent: number;

  @Column({ default: 0 })
  multiKillOneSpell: number;

  @Column({ default: 0 })
  multiTurretRiftHeraldCount: number;

  @Column({ default: 0 })
  multikills: number;

  @Column({ default: 0 })
  multikillsAfterAggressiveFlash: number;

  @Column({ default: 0 })
  mythicItemUsed: number;

  @Column({ default: 0 })
  outerTurretExecutesBefore10Minutes: number;

  @Column({ default: 0 })
  outnumberedKills: number;

  @Column({ default: 0 })
  outnumberedNexusKill: number;

  @Column({ default: 0 })
  perfectDragonSoulsTaken: number;

  @Column({ default: 0 })
  perfectGame: number;

  @Column({ default: 0 })
  pickKillWithAlly: number;

  @Column({ default: 0 })
  poroExplosions: number;

  @Column({ default: 0 })
  quickCleanse: number;

  @Column({ default: 0 })
  quickFirstTurret: number;

  @Column({ default: 0 })
  quickSoloKills: number;

  @Column({ default: 0 })
  riftHeraldTakedowns: number;

  @Column({ default: 0 })
  saveAllyFromDeath: number;

  @Column({ default: 0 })
  scuttleCrabKills: number;

  @Column({ default: 0 })
  skillshotsDodged: number;

  @Column({ default: 0 })
  skillshotsHit: number;

  @Column({ default: 0 })
  snowballsHit: number;

  @Column({ default: 0 })
  soloBaronKills: number;

  @Column({ default: 0 })
  soloKills: number;

  @Column({ default: 0 })
  stealthWardsPlaced: number;

  @Column({ default: 0 })
  survivedSingleDigitHpCount: number;

  @Column({ default: 0 })
  survivedThreeImmobilizesInFight: number;

  @Column({ default: 0 })
  takedownOnFirstTurret: number;

  @Column({ default: 0 })
  takedowns: number;

  @Column({ default: 0 })
  takedownsAfterGainingLevelAdvantage: number;

  @Column({ default: 0 })
  takedownsBeforeJungleMinionSpawn: number;

  @Column({ default: 0 })
  takedownsFirstXMinutes: number;

  @Column({ default: 0 })
  takedownsInAlcove: number;

  @Column({ default: 0 })
  takedownsInEnemyFountain: number;

  @Column({ default: 0 })
  teamBaronKills: number;

  @Column({ default: 0 })
  teamElderDragonKills: number;

  @Column({ default: 0 })
  teamRiftHeraldKills: number;

  @Column({ default: 0 })
  threeWardsOneSweeperCount: number;

  @Column({ default: 0 })
  tookLargeDamageSurvived: number;

  @Column({ default: 0 })
  turretPlatesTaken: number;

  @Column({ default: 0 })
  turretTakedowns: number;

  @Column({ default: 0 })
  turretsTakenWithRiftHerald: number;

  @Column({ default: 0 })
  twentyMinionsIn3SecondsCount: number;

  @Column({ default: 0 })
  unseenRecalls: number;

  @Column({ default: 0 })
  wardTakedowns: number;

  @Column({ default: 0 })
  wardTakedownsBefore20M: number;

  @Column({ default: 0 })
  wardsGuarded: number;
}

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  participantId: number;

  @ManyToOne(() => MatchInfo, (matchInfo) => matchInfo.participants)
  @JoinColumn({ name: 'matchId', referencedColumnName: 'matchId' })
  matchInfo: MatchInfo;

  @ManyToOne(() => Summoner, (summoner) => summoner.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'summonerId', referencedColumnName: 'id' })
  summoner: Summoner;

  @Column({ default: 0 })
  assists: number;

  @Column({ default: 0 })
  baronKills: number;

  @Column({ default: 0 })
  bountyLevel: number;

  @OneToOne(() => Challenge, { cascade: true, eager: true })
  @JoinColumn({ name: 'challengeId', referencedColumnName: 'challengeId' })
  challenges: Challenge;

  @Column({ default: 0 })
  champExperience: number;

  @Column({ default: 0 })
  champLevel: number;

  @Column({ default: 0 })
  championId: number;

  @Column()
  championName: string;

  @Column({ default: 0 })
  championTransform: number;

  @Column({ default: 0 })
  damageDealtToBuildings: number;

  @Column({ default: 0 })
  damageDealtToObjectives: number;

  @Column({ default: 0 })
  damageDealtToTurrets: number;

  @Column({ default: 0 })
  damageSelfMitigated: number;

  @Column({ default: 0 })
  deaths: number;

  @Column({ default: 0 })
  detectorWardsPlaced: number;

  @Column({ default: 0 })
  doubleKills: number;

  @Column({ default: 0 })
  dragonKills: number;

  @Column()
  firstBloodAssist: boolean;

  @Column()
  firstBloodKill: boolean;

  @Column()
  firstTowerAssist: boolean;

  @Column()
  firstTowerKill: boolean;

  @Column({ default: 0 })
  goldEarned: number;

  @Column({ default: 0 })
  goldSpent: number;

  @Column()
  individualPosition: string;

  @Column({ default: 0 })
  inhibitorKills: number;

  @Column({ default: 0 })
  inhibitorTakedowns: number;

  @Column({ default: 0 })
  inhibitorsLost: number;

  @Column({ default: 0 })
  itemsPurchased: number;

  @Column({ default: 0 })
  killingSprees: number;

  @Column({ default: 0 })
  kills: number;

  @Column()
  lane: string;

  @Column({ default: 0 })
  largestCriticalStrike: number;

  @Column({ default: 0 })
  largestKillingSpree: number;

  @Column({ default: 0 })
  largestMultiKill: number;

  @Column({ default: 0 })
  longestTimeSpentLiving: number;

  @Column({ default: 0 })
  magicDamageDealt: number;

  @Column({ default: 0 })
  magicDamageDealtToChampions: number;

  @Column({ default: 0 })
  magicDamageTaken: number;

  @Column({ default: 0 })
  neutralMinionsKilled: number;

  @Column({ default: 0 })
  nexusKills: number;

  @Column({ default: 0 })
  nexusLost: number;

  @Column({ default: 0 })
  nexusTakedowns: number;

  @Column({ default: 0 })
  objectivesStolen: number;

  @Column({ default: 0 })
  objectivesStolenAssists: number;

  @Column({ default: 0 })
  pentaKills: number;

  @Column({ default: 0 })
  physicalDamageDealt: number;

  @Column({ default: 0 })
  physicalDamageDealtToChampions: number;

  @Column({ default: 0 })
  physicalDamageTaken: number;

  @Column({ default: 0 })
  profileIcon: number;

  @Column({ default: 0 })
  quadraKills: number;

  @Column()
  role: string;

  @Column({ default: '' })
  riotIdGameName: string;

  @Column({ default: '' })
  riotIdTagline: string;

  @Column({ default: 0 })
  sightWardsBoughtInGame: number;

  @Column({ default: 0 })
  spell1Casts: number;

  @Column({ default: 0 })
  spell2Casts: number;

  @Column({ default: 0 })
  spell3Casts: number;

  @Column({ default: 0 })
  spell4Casts: number;

  @Column({ default: 0 })
  summoner1Casts: number;

  @Column({ default: 0 })
  summoner1Id: number;

  @Column({ default: 0 })
  summoner2Casts: number;

  @Column({ default: 0 })
  summoner2Id: number;

  @Column({ default: 0 })
  timeCCingOthers: number;

  @Column({ default: 0 })
  timePlayed: number;

  @Column({ default: 0 })
  totalDamageDealt: number;

  @Column({ default: 0 })
  totalDamageDealtToChampions: number;

  @Column({ default: 0 })
  totalDamageShieldedOnTeammates: number;

  @Column({ default: 0 })
  totalDamageTaken: number;

  @Column({ default: 0 })
  totalHeal: number;

  @Column({ default: 0 })
  totalHealsOnTeammates: number;

  @Column({ default: 0 })
  totalMinionsKilled: number;

  @Column({ default: 0 })
  totalTimeCCDealt: number;

  @Column({ default: 0 })
  totalTimeSpentDead: number;

  @Column({ default: 0 })
  totalUnitsHealed: number;

  @Column({ default: 0 })
  tripleKills: number;

  @Column({ default: 0 })
  trueDamageDealt: number;

  @Column({ default: 0 })
  trueDamageDealtToChampions: number;

  @Column({ default: 0 })
  trueDamageTaken: number;

  @Column({ default: 0 })
  turretKills: number;

  @Column({ default: 0 })
  turretTakedowns: number;

  @Column({ default: 0 })
  turretsLost: number;

  @Column({ default: 0 })
  unrealKills: number;

  @Column({ default: 0 })
  visionScore: number;

  @Column({ default: 0 })
  visionWardsBoughtInGame: number;

  @Column({ default: 0 })
  wardsKilled: number;

  @Column({ default: 0 })
  wardsPlaced: number;

  @Column()
  win: boolean;
}

// @Entity()
// export class Objective {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;

//   @Column()
//   first: boolean;

//   @Column({ default: 0 })
//   kills: number;
// }

// @Entity()
// export class Objectives {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;

//   @OneToOne(() => Objective, { cascade: true, eager: true })
//   @JoinColumn()
//   baron: Objective;

//   @OneToOne(() => Objective, { cascade: true, eager: true })
//   @JoinColumn()
//   champion: Objective;

//   @OneToOne(() => Objective, { cascade: true, eager: true })
//   @JoinColumn()
//   dragon: Objective;

//   @OneToOne(() => Objective, { cascade: true, eager: true })
//   @JoinColumn()
//   inhibitor: Objective;

//   @OneToOne(() => Objective, { cascade: true, eager: true })
//   @JoinColumn()
//   riftHerald: Objective;

//   @OneToOne(() => Objective, { cascade: true, eager: true })
//   @JoinColumn()
//   tower: Objective;
// }

// @Entity()
// export class Team {
//   @PrimaryColumn({ unique: true })
//   teamId: number;

//   @OneToOne(() => Objectives, { cascade: true, eager: true })
//   @JoinColumn()
//   objectives: Objectives;

//   @Column()
//   win: boolean;
// }

// @Entity()
// export class PerkStats {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @Column({ default: 0 })
//   defense: number;
//   @Column({ default: 0 })
//   flex: number;
//   @Column({ default: 0 })
//   offense: number;
// }
// @Entity()
// export class Perks {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @OneToOne(() => PerkStats)
//   @JoinColumn()
//   statPerks: PerkStats;
//   @OneToMany(() => PerkStyle, (style) => style.perks, {
//     cascade: true,
//     eager: true,
//   })
//   @JoinColumn({ referencedColumnName: 'uuid' })
//   styles: PerkStyle[];
// }
// @Entity()
// export class PerkStyle {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @OneToMany(() => PerkStyleSelection, (selection) => selection.style, {
//     cascade: true,
//     eager: true,
//   })
//   @JoinColumn({ referencedColumnName: 'uuid' })
//   selections: PerkStyleSelection[];
//   @ManyToOne(() => Perks, (perks) => perks.styles)
//   perks: Perks;
//   @Column()
//   description: string;
//   @Column({ default: 0 })
//   style: number;
// }
// @Entity()
// export class PerkStyleSelection {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @ManyToOne(() => PerkStyle, (style) => style.selections)
//   style: PerkStyle;
//   @Column({ default: 0 })
//   perk: number;
//   @Column({ default: 0 })
//   var1: number;
//   @Column({ default: 0 })
//   var2: number;
//   @Column({ default: 0 })
//   var3: number;
// }

// @Entity()
// export class Objective {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @Column()
//   first: boolean;
//   @Column({ default: 0 })
//   kills: number;
// }
// @Entity()
// export class Objectives {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @OneToOne(() => Objective)
//   @JoinColumn()
//   baron: Objective;
//   @OneToOne(() => Objective)
//   @JoinColumn()
//   champion: Objective;
//   @OneToOne(() => Objective)
//   @JoinColumn()
//   dragon: Objective;
//   @OneToOne(() => Objective)
//   @JoinColumn()
//   inhibitor: Objective;
//   @OneToOne(() => Objective)
//   @JoinColumn()
//   riftHerald: Objective;
//   @OneToOne(() => Objective)
//   @JoinColumn()
//   tower: Objective;
// }
// @Entity()
// export class MatchInfo {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @OneToMany(() => Participant, (participant) => participant.info, {
//     cascade: true,
//     eager: true,
//   })
//   // @JoinColumn({ referencedColumnName: 'uuid' })
//   participants: Participant[];
//   @OneToMany(() => Team, (team) => team.info, { cascade: true, eager: true })
//   @JoinColumn({ referencedColumnName: 'uuid' })
//   teams: Team[];
//   @Column('bigint', { default: 0 })
//   gameCreation: number;
//   @Column({ default: 0 })
//   gameDuration: number;
//   @Column('bigint', { default: 0 })
//   gameEndTimestamp: number;
//   @Column('bigint', { default: 0 })
//   gameId: number;
//   @Column()
//   gameMode: string;
//   @Column()
//   gameName: string;
//   @Column('bigint', { default: 0 })
//   gameStartTimestamp: number;
//   @Column()
//   gameType: string;
//   @Column()
//   gameVersion: string;
//   @Column({ default: 0 })
//   mapId: number;
//   @Column()
//   platformId: string;
//   @Column({ default: 0 })
//   queueId: number;
//   @Column()
//   tournamentCode: string;
// }
// @Entity()
// export class Team {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @ManyToOne(() => MatchInfo, (match) => match.teams)
//   info: MatchInfo;
//   @OneToMany(() => Ban, (ban) => ban.team, { cascade: true, eager: true })
//   @JoinColumn({ referencedColumnName: 'uuid' })
//   bans: Ban[];
//   @OneToOne(() => Objectives)
//   @JoinColumn()
//   objectives: Objectives;
//   @Column({ default: 0 })
//   teamId: number;
//   @Column()
//   win: boolean;
// }
// @Entity()
// export class Ban {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @ManyToOne(() => Team, (team) => team.bans)
//   team: Team;
//   @Column({ default: 0 })
//   championId: number;
//   @Column({ default: 0 })
//   pickTurn: number;
// }
// @Entity()
// export class Challenge {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @Column({ default: 0 })
//   '12AssistStreakCount': number;
//   @Column({ default: 0 })
//   abilityUses: number;
//   @Column({ default: 0 })
//   acesBefore15Minutes: number;
//   @Column({ default: 0 })
//   alliedJungleMonsterKills: number;
//   @Column({ default: 0 })
//   baronTakedowns: number;
//   @Column({ default: 0 })
//   blastConeOppositeOpponentCount: number;
//   @Column({ default: 0 })
//   bountyGold: number;
//   @Column({ default: 0 })
//   buffsStolen: number;
//   @Column({ default: 0 })
//   completeSupportQuestInTime: number;
//   @Column('decimal', { default: 0 })
//   controlWardTimeCoverageInRiverOrEnemyHalf: number;
//   @Column({ default: 0 })
//   controlWardsPlaced: number;
//   @Column('decimal', { default: 0 })
//   damagePerMinute: number;
//   @Column('decimal', { default: 0 })
//   damageTakenOnTeamPercentage: number;
//   @Column({ default: 0 })
//   dancedWithRiftHerald: number;
//   @Column({ default: 0 })
//   deathsByEnemyChamps: number;
//   @Column({ default: 0 })
//   dodgeSkillShotsSmallWindow: number;
//   @Column({ default: 0 })
//   doubleAces: number;
//   @Column({ default: 0 })
//   dragonTakedowns: number;
//   @Column('decimal', { default: 0 })
//   earliestDragonTakedown: number;
//   @Column({ default: 0 })
//   earlyLaningPhaseGoldExpAdvantage: number;
//   @Column('decimal', { default: 0 })
//   effectiveHealAndShielding: number;
//   @Column({ default: 0 })
//   elderDragonKillsWithOpposingSoul: number;
//   @Column({ default: 0 })
//   elderDragonMultikills: number;
//   @Column({ default: 0 })
//   enemyChampionImmobilizations: number;
//   @Column({ default: 0 })
//   enemyJungleMonsterKills: number;
//   @Column({ default: 0 })
//   epicMonsterKillsNearEnemyJungler: number;
//   @Column({ default: 0 })
//   epicMonsterKillsWithin30SecondsOfSpawn: number;
//   @Column({ default: 0 })
//   epicMonsterSteals: number;
//   @Column({ default: 0 })
//   epicMonsterStolenWithoutSmite: number;
//   @Column({ default: 0 })
//   flawlessAces: number;
//   @Column({ default: 0 })
//   fullTeamTakedown: number;
//   @Column('decimal', { default: 0 })
//   gameLength: number;
//   @Column({ default: 0 })
//   getTakedownsInAllLanesEarlyJungleAsLaner: number;
//   @Column('decimal', { default: 0 })
//   goldPerMinute: number;
//   @Column({ default: 0 })
//   hadOpenNexus: number;
//   @Column({ default: 0 })
//   immobilizeAndKillWithAlly: number;
//   @Column({ default: 0 })
//   initialBuffCount: number;
//   @Column({ default: 0 })
//   initialCrabCount: number;
//   @Column('decimal', { default: 0 })
//   jungleCsBefore10Minutes: number;
//   @Column({ default: 0 })
//   junglerTakedownsNearDamagedEpicMonster: number;
//   @Column({ default: 0 })
//   kTurretsDestroyedBeforePlatesFall: number;
//   @Column('decimal', { default: 0 })
//   kda: number;
//   @Column({ default: 0 })
//   killAfterHiddenWithAlly: number;
//   @Column('decimal', { default: 0 })
//   killParticipation: number;
//   @Column({ default: 0 })
//   killedChampTookFullTeamDamageSurvived: number;
//   @Column({ default: 0 })
//   killingSprees: number;
//   @Column({ default: 0 })
//   killsNearEnemyTurret: number;
//   @Column({ default: 0 })
//   killsOnOtherLanesEarlyJungleAsLaner: number;
//   @Column({ default: 0 })
//   killsOnRecentlyHealedByAramPack: number;
//   @Column({ default: 0 })
//   killsUnderOwnTurret: number;
//   @Column({ default: 0 })
//   killsWithHelpFromEpicMonster: number;
//   @Column({ default: 0 })
//   knockEnemyIntoTeamAndKill: number;
//   @Column({ default: 0 })
//   landSkillShotsEarlyGame: number;
//   @Column({ default: 0 })
//   laneMinionsFirst10Minutes: number;
//   @Column({ default: 0 })
//   laningPhaseGoldExpAdvantage: number;
//   @Column({ default: 0 })
//   legendaryCount: number;
//   @Column({ default: 0 })
//   lostAnInhibitor: number;
//   @Column('decimal', { default: 0 })
//   maxCsAdvantageOnLaneOpponent: number;
//   @Column({ default: 0 })
//   maxKillDeficit: number;
//   @Column({ default: 0 })
//   maxLevelLeadLaneOpponent: number;
//   @Column('decimal', { default: 0 })
//   moreEnemyJungleThanOpponent: number;
//   @Column({ default: 0 })
//   multiKillOneSpell: number;
//   @Column({ default: 0 })
//   multiTurretRiftHeraldCount: number;
//   @Column({ default: 0 })
//   multikills: number;
//   @Column({ default: 0 })
//   multikillsAfterAggressiveFlash: number;
//   @Column({ default: 0 })
//   mythicItemUsed: number;
//   @Column({ default: 0 })
//   outerTurretExecutesBefore10Minutes: number;
//   @Column({ default: 0 })
//   outnumberedKills: number;
//   @Column({ default: 0 })
//   outnumberedNexusKill: number;
//   @Column({ default: 0 })
//   perfectDragonSoulsTaken: number;
//   @Column({ default: 0 })
//   perfectGame: number;
//   @Column({ default: 0 })
//   pickKillWithAlly: number;
//   @Column({ default: 0 })
//   poroExplosions: number;
//   @Column({ default: 0 })
//   quickCleanse: number;
//   @Column({ default: 0 })
//   quickFirstTurret: number;
//   @Column({ default: 0 })
//   quickSoloKills: number;
//   @Column({ default: 0 })
//   riftHeraldTakedowns: number;
//   @Column({ default: 0 })
//   saveAllyFromDeath: number;
//   @Column({ default: 0 })
//   scuttleCrabKills: number;
//   @Column({ default: 0 })
//   skillshotsDodged: number;
//   @Column({ default: 0 })
//   skillshotsHit: number;
//   @Column({ default: 0 })
//   snowballsHit: number;
//   @Column({ default: 0 })
//   soloBaronKills: number;
//   @Column({ default: 0 })
//   soloKills: number;
//   @Column({ default: 0 })
//   stealthWardsPlaced: number;
//   @Column({ default: 0 })
//   survivedSingleDigitHpCount: number;
//   @Column({ default: 0 })
//   survivedThreeImmobilizesInFight: number;
//   @Column({ default: 0 })
//   takedownOnFirstTurret: number;
//   @Column({ default: 0 })
//   takedowns: number;
//   @Column({ default: 0 })
//   takedownsAfterGainingLevelAdvantage: number;
//   @Column({ default: 0 })
//   takedownsBeforeJungleMinionSpawn: number;
//   @Column({ default: 0 })
//   takedownsFirstXMinutes: number;
//   @Column({ default: 0 })
//   takedownsInAlcove: number;
//   @Column({ default: 0 })
//   takedownsInEnemyFountain: number;
//   @Column({ default: 0 })
//   teamBaronKills: number;
//   @Column('decimal', { default: 0 })
//   teamDamagePercentage: number;
//   @Column({ default: 0 })
//   teamElderDragonKills: number;
//   @Column({ default: 0 })
//   teamRiftHeraldKills: number;
//   @Column({ default: 0 })
//   threeWardsOneSweeperCount: number;
//   @Column({ default: 0 })
//   tookLargeDamageSurvived: number;
//   @Column({ default: 0 })
//   turretPlatesTaken: number;
//   @Column({ default: 0 })
//   turretTakedowns: number;
//   @Column({ default: 0 })
//   turretsTakenWithRiftHerald: number;
//   @Column({ default: 0 })
//   twentyMinionsIn3SecondsCount: number;
//   @Column({ default: 0 })
//   unseenRecalls: number;
//   @Column('decimal', { default: 0 })
//   visionScoreAdvantageLaneOpponent: number;
//   @Column('decimal', { default: 0 })
//   visionScorePerMinute: number;
//   @Column({ default: 0 })
//   wardTakedowns: number;
//   @Column({ default: 0 })
//   wardTakedownsBefore20M: number;
//   @Column({ default: 0 })
//   wardsGuarded: number;
// }
// @Entity()
// export class MatchMetadata {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @Column('text', { array: true })
//   participants: string[];
//   @Column()
//   dataVersion: string;
//   @Column()
//   matchId: string;
// }
// @Entity()
// export class Participant {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @ManyToOne(() => Summoner, (summoner) => summoner.participants, {
//     cascade: true,
//     eager: true,
//   })
//   @JoinColumn({ name: 'summonerId', referencedColumnName: 'id' })
//   summoner: Summoner;
//   @OneToOne(() => Team, {
//     cascade: true,
//     eager: true,
//   })
//   @JoinColumn({ name: 'teamId', referencedColumnName: 'uuid' })
//   team: Team;
//   @OneToOne(() => Challenge)
//   @JoinColumn()
//   challenges: Challenge;
//   @OneToOne(() => Perks)
//   @JoinColumn()
//   perks: Perks;
//   @ManyToOne(() => MatchInfo, (match) => match.participants)
//   info: MatchInfo;
//   @Column({ default: 0 })
//   allInPings: number;
//   @Column({ default: 0 })
//   assistMePings: number;
//   @Column({ default: 0 })
//   assists: number;
//   @Column({ default: 0 })
//   baitPings: number;
//   @Column({ default: 0 })
//   baronKills: number;
//   @Column({ default: 0 })
//   basicPings: number;
//   @Column({ default: 0 })
//   bountyLevel: number;
//   @Column({ default: 0 })
//   champExperience: number;
//   @Column({ default: 0 })
//   champLevel: number;
//   @Column({ default: 0 })
//   championId: number;
//   @Column()
//   championName: string;
//   @Column({ default: 0 })
//   championTransform: number;
//   @Column({ default: 0 })
//   commandPings: number;
//   @Column({ default: 0 })
//   consumablesPurchased: number;
//   @Column({ default: 0 })
//   damageDealtToBuildings: number;
//   @Column({ default: 0 })
//   damageDealtToObjectives: number;
//   @Column({ default: 0 })
//   damageDealtToTurrets: number;
//   @Column({ default: 0 })
//   damageSelfMitigated: number;
//   @Column({ default: 0 })
//   dangerPings: number;
//   @Column({ default: 0 })
//   deaths: number;
//   @Column({ default: 0 })
//   detectorWardsPlaced: number;
//   @Column({ default: 0 })
//   doubleKills: number;
//   @Column({ default: 0 })
//   dragonKills: number;
//   @Column()
//   eligibleForProgression: boolean;
//   @Column({ default: 0 })
//   enemyMissingPings: number;
//   @Column({ default: 0 })
//   enemyVisionPings: number;
//   @Column()
//   firstBloodAssist: boolean;
//   @Column()
//   firstBloodKill: boolean;
//   @Column()
//   firstTowerAssist: boolean;
//   @Column()
//   firstTowerKill: boolean;
//   @Column()
//   gameEndedInEarlySurrender: boolean;
//   @Column()
//   gameEndedInSurrender: boolean;
//   @Column({ default: 0 })
//   getBackPings: number;
//   @Column({ default: 0 })
//   goldEarned: number;
//   @Column({ default: 0 })
//   goldSpent: number;
//   @Column({ default: 0 })
//   holdPings: number;
//   @Column()
//   individualPosition: string;
//   @Column({ default: 0 })
//   inhibitorKills: number;
//   @Column({ default: 0 })
//   inhibitorTakedowns: number;
//   @Column({ default: 0 })
//   inhibitorsLost: number;
//   @Column({ default: 0 })
//   item0: number;
//   @Column({ default: 0 })
//   item1: number;
//   @Column({ default: 0 })
//   item2: number;
//   @Column({ default: 0 })
//   item3: number;
//   @Column({ default: 0 })
//   item4: number;
//   @Column({ default: 0 })
//   item5: number;
//   @Column({ default: 0 })
//   item6: number;
//   @Column({ default: 0 })
//   itemsPurchased: number;
//   @Column({ default: 0 })
//   killingSprees: number;
//   @Column({ default: 0 })
//   kills: number;
//   @Column()
//   lane: string;
//   @Column({ default: 0 })
//   largestCriticalStrike: number;
//   @Column({ default: 0 })
//   largestKillingSpree: number;
//   @Column({ default: 0 })
//   largestMultiKill: number;
//   @Column({ default: 0 })
//   longestTimeSpentLiving: number;
//   @Column({ default: 0 })
//   magicDamageDealt: number;
//   @Column({ default: 0 })
//   magicDamageDealtToChampions: number;
//   @Column({ default: 0 })
//   magicDamageTaken: number;
//   @Column({ default: 0 })
//   needVisionPings: number;
//   @Column({ default: 0 })
//   neutralMinionsKilled: number;
//   @Column({ default: 0 })
//   nexusKills: number;
//   @Column({ default: 0 })
//   nexusLost: number;
//   @Column({ default: 0 })
//   nexusTakedowns: number;
//   @Column({ default: 0 })
//   objectivesStolen: number;
//   @Column({ default: 0 })
//   objectivesStolenAssists: number;
//   @Column({ default: 0 })
//   onMyWayPings: number;
//   @Column({ default: 0 })
//   participantId: number;
//   @Column({ default: 0 })
//   pentaKills: number;
//   @Column({ default: 0 })
//   physicalDamageDealt: number;
//   @Column({ default: 0 })
//   physicalDamageDealtToChampions: number;
//   @Column({ default: 0 })
//   physicalDamageTaken: number;
//   @Column({ default: 0 })
//   profileIcon: number;
//   @Column({ default: 0 })
//   pushPings: number;
//   @Column({ default: 0 })
//   quadraKills: number;
//   @Column()
//   riotIdName: string;
//   @Column()
//   riotIdTagline: string;
//   @Column()
//   role: string;
//   @Column({ default: 0 })
//   sightWardsBoughtInGame: number;
//   @Column({ default: 0 })
//   spell1Casts: number;
//   @Column({ default: 0 })
//   spell2Casts: number;
//   @Column({ default: 0 })
//   spell3Casts: number;
//   @Column({ default: 0 })
//   spell4Casts: number;
//   @Column({ default: 0 })
//   summoner1Casts: number;
//   @Column({ default: 0 })
//   summoner1Id: number;
//   @Column({ default: 0 })
//   summoner2Casts: number;
//   @Column({ default: 0 })
//   summoner2Id: number;
//   @Column()
//   teamEarlySurrendered: boolean;
//   @Column()
//   teamPosition: string;
//   @Column({ default: 0 })
//   timeCCingOthers: number;
//   @Column({ default: 0 })
//   timePlayed: number;
//   @Column({ default: 0 })
//   totalDamageDealt: number;
//   @Column({ default: 0 })
//   totalDamageDealtToChampions: number;
//   @Column({ default: 0 })
//   totalDamageShieldedOnTeammates: number;
//   @Column({ default: 0 })
//   totalDamageTaken: number;
//   @Column({ default: 0 })
//   totalHeal: number;
//   @Column({ default: 0 })
//   totalHealsOnTeammates: number;
//   @Column({ default: 0 })
//   totalMinionsKilled: number;
//   @Column({ default: 0 })
//   totalTimeCCDealt: number;
//   @Column({ default: 0 })
//   totalTimeSpentDead: number;
//   @Column({ default: 0 })
//   totalUnitsHealed: number;
//   @Column({ default: 0 })
//   tripleKills: number;
//   @Column({ default: 0 })
//   trueDamageDealt: number;
//   @Column({ default: 0 })
//   trueDamageDealtToChampions: number;
//   @Column({ default: 0 })
//   trueDamageTaken: number;
//   @Column({ default: 0 })
//   turretKills: number;
//   @Column({ default: 0 })
//   turretTakedowns: number;
//   @Column({ default: 0 })
//   turretsLost: number;
//   @Column({ default: 0 })
//   unrealKills: number;
//   @Column({ default: 0 })
//   visionClearedPings: number;
//   @Column({ default: 0 })
//   visionScore: number;
//   @Column({ default: 0 })
//   visionWardsBoughtInGame: number;
//   @Column({ default: 0 })
//   wardsKilled: number;
//   @Column({ default: 0 })
//   wardsPlaced: number;
//   @Column()
//   win: boolean;
// }

// @Entity()
// export class Match {
//   @PrimaryGeneratedColumn('uuid')
//   uuid: string;
//   @OneToOne(() => MatchMetadata, { cascade: true, eager: true })
//   @JoinColumn()
//   metadata: MatchMetadata;
//   @OneToOne(() => MatchInfo, { cascade: true, eager: true })
//   @JoinColumn()
//   info: MatchInfo;
//   @Column()
//   region: string;
// }
