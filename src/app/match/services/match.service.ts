import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Ban,
  Challenge,
  Match,
  MatchInfo,
  MatchMetadata,
  Objective,
  Objectives,
  Participant,
  PerkStats,
  PerkStyle,
  PerkStyleSelection,
  Perks,
  Team,
} from '../entities/match.entity';
import { DataSource, Repository } from 'typeorm';
import { REPOSITORIES } from '../../../config/constants';
import { Summoner } from '../../summoner/entities/summoner.entity';
import { SummonerService } from '../../summoner/services/summoner.service';
import { RiotAPIService } from '../../riot-api/riot.api.service';
import {
  MatchDto,
  MatchInfoDTO,
  MatchMetadataDTO,
  ParticipantDTO,
  TeamDTO,
  ChallengeDTO,
  PerkStatsDTO,
  PerksDTO,
  PerkStyleDTO,
  PerkStyleSelectionDTO,
} from '../dto/match.dto';
import { BanDTO } from '../dto/match.dto';
import { ObjectivesDTO } from '../dto/match.dto';
import { ObjectiveDTO } from '../dto/match.dto';
import { mapParticipantsToDto } from './match.service.utils';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @Inject(REPOSITORIES.SOURCE)
    private readonly dataSource: Repository<DataSource>,
    private readonly summonerService: SummonerService,
    private readonly riotService: RiotAPIService,
  ) {}

  async insertAllMatchDtos(matchDto: MatchDto) {
    const metadataDto = matchDto.metadata;
    const infoDto = matchDto.info;

    // Insert all the data
    const metadata = await this.insertMetadata(metadataDto);
    matchDto.metadata = metadata;
    const info = await this.insertInfo(infoDto);
    matchDto.info = info;

    // Create the match
    const match = await this.dataSource.manager.create(Match, matchDto);
    const matchResult = await this.dataSource.manager.insert(Match, match);
    console.log('matchResult: ', matchResult);

    const newMatchDto: MatchDto = { ...matchDto };
    return newMatchDto;
  }

  async insertMetadata(metadataDto: MatchMetadataDTO) {
    const metadata = await this.dataSource.manager.create(
      MatchMetadata,
      metadataDto,
    );
    const metadataResult = await this.dataSource.manager.insert(
      MatchMetadata,
      metadata,
    );
    console.log('metadataResult: ', metadataResult);
    return metadata;
  }

  async insertInfo(infoDto: MatchInfoDTO) {
    const participantsDto = infoDto.participants;
    const teamsDto = infoDto.teams;

    const teams = await this.insertTeams(teamsDto);
    infoDto.teams = teams;
    const participants = await this.insertParticipants(participantsDto);
    infoDto.participants = participants;

    const info = await this.dataSource.manager.create(MatchInfo, infoDto);
    const infoResult = await this.dataSource.manager.insert(MatchInfo, info);
    console.log('infoResult: ', infoResult);

    const newInfoDto: MatchInfoDTO = {
      ...info,
      participants: participants,
    };

    return newInfoDto;
  }

  async insertParticipants(participantsDto: ParticipantDTO[]) {
    // for (let index = 0; index < participantsDto.length; index++) {
    //   const challengeDto = participantsDto[index].challenges;
    //   const perksDto = participantsDto[index].perks;

    //   const challenge = await this.insertChallenges(challengeDto);
    //   participantsDto[index].challenges = challenge;
    //   const perks = await this.insertPerks(perksDto);
    //   participantsDto[index].perks = perks;
    // }
    const challengeDto = participantsDto[0].challenges;
    const perksDto = participantsDto[0].perks;

    const challenge = await this.insertChallenges(challengeDto);
    participantsDto[0].challenges = challenge;
    const perks = await this.insertPerks(perksDto);
    participantsDto[0].perks = perks;

    const summoner = await this.dataSource.manager.findOne(Summoner, {
      where: { id: participantsDto[0].summonerId },
    });
    const team = await this.dataSource.manager.findOne(Team, {
      where: { teamId: participantsDto[0].teamId },
    });
    const participants = await this.dataSource.manager.create(
      Participant,
      participantsDto,
    );
    participants[0].summoner = summoner;
    participants[0].team = team;
    await this.dataSource.manager.insert(Participant, participants);
    // console.log('participantResult: ', participantResult);
    const newParticipantsDto = mapParticipantsToDto(participants);
    return newParticipantsDto;
  }

  async insertChallenges(challengesDto: ChallengeDTO) {
    const challenges = await this.dataSource.manager.create(
      Challenge,
      challengesDto,
    );
    const challengesResult = await this.dataSource.manager.insert(
      Challenge,
      challenges,
    );
    console.log('challengesResult: ', challengesResult);
    return challenges;
  }

  async insertPerks(perksDto: PerksDTO) {
    const perksStatsDto = perksDto.statPerks;
    const perksStyleDto = perksDto.styles;

    const perkStats = await this.insertPerkStats(perksStatsDto);
    perksDto.statPerks = perkStats;
    const perkStyles = await this.insertPerkStyles(perksStyleDto);
    perksDto.styles = perkStyles;

    const perks = await this.dataSource.manager.create(Perks, perksDto);
    const perksResult = await this.dataSource.manager.insert(Perks, perks);
    console.log('perksResult: ', perksResult);
    return perks;
  }

  async insertPerkStats(perkStatsDto: PerkStatsDTO) {
    const perkStats = await this.dataSource.manager.create(
      PerkStats,
      perkStatsDto,
    );
    const perkStatsResult = await this.dataSource.manager.insert(
      PerkStats,
      perkStats,
    );
    console.log('perkStatsResult: ', perkStatsResult);
    return perkStats;
  }

  async insertPerkStyles(perkStylesDto: PerkStyleDTO[]) {
    for (let index = 0; index < perkStylesDto.length; index++) {
      const perkStylesSelectionsDto = perkStylesDto[index].selections;
      const perkStyleSelections = await this.insertPerkStyleSelections(
        perkStylesSelectionsDto,
      );
      perkStylesDto[index].selections = perkStyleSelections;
    }
    const perkStyles = await this.dataSource.manager.create(
      PerkStyle,
      perkStylesDto,
    );
    const perkStylesResult = await this.dataSource.manager.insert(
      PerkStyle,
      perkStylesDto,
    );
    console.log('perkStylesResult: ', perkStylesResult);
    return perkStyles;
  }

  async insertPerkStyleSelections(
    perkStyleSelectionsDto: PerkStyleSelectionDTO[],
  ) {
    const perkStyleSelections = await this.dataSource.manager.create(
      PerkStyleSelection,
      perkStyleSelectionsDto,
    );

    const perkStyleSelectionsResult = await this.dataSource.manager.insert(
      PerkStyleSelection,
      perkStyleSelections,
    );
    console.log('perkStyleSelectionsResult: ', perkStyleSelectionsResult);
    return perkStyleSelections;
  }

  async insertTeams(teamsDto: TeamDTO[]) {
    for (let index = 0; index < teamsDto.length; index++) {
      const bansDto = teamsDto[index].bans;
      const objectivesDto = teamsDto[index].objectives;

      const bans = await this.insertBans(bansDto);
      teamsDto[index].bans = bans;
      const objectives = await this.insertObjectives(objectivesDto);
      teamsDto[index].objectives = objectives;
    }
    const teams = await this.dataSource.manager.create(Team, teamsDto);
    const teamsResult = await this.dataSource.manager.insert(Team, teams);
    console.log('teamsResult: ', teamsResult);
    return teams;
  }

  async insertBans(bansDto: BanDTO[]) {
    const bans = await this.dataSource.manager.create(Ban, bansDto);
    const bansResult = await this.dataSource.manager.insert(Ban, bansDto);
    console.log('bansResult: ', bansResult);
    return bans;
  }

  async insertObjectives(objectivesDto: ObjectivesDTO) {
    for (const keys of Object.keys(objectivesDto)) {
      const objectiveDto: ObjectiveDTO = objectivesDto[keys];

      const objective = await this.insertObjective(objectiveDto);
      objectivesDto[keys] = objective;
    }
    const objectives = await this.dataSource.manager.create(
      Objectives,
      objectivesDto,
    );
    const objectivesResult = await this.dataSource.manager.insert(
      Objectives,
      objectives,
    );
    console.log('objectivesResult: ', objectivesResult);
    return objectives;
  }

  async insertObjective(objectiveDto: ObjectiveDTO) {
    const objective = await this.dataSource.manager.create(
      Objective,
      objectiveDto,
    );
    const objectivesResult = await this.dataSource.manager.insert(
      Objective,
      objective,
    );
    console.log('objectivesResult: ', objectivesResult);
    return objective;
  }

  findAll(region: string) {
    return this.matchRepository.find({
      where: {
        region: region,
      },
    });
  }

  async findMatchesBySizeLimitAndSummonerName(
    region: string,
    summonerName: string,
    size?: number,
    limit = 20,
  ) {
    let summoner = await this.dataSource.manager.findOneBy(Summoner, {
      region,
      name: summonerName,
    });

    if (!summoner) {
      summoner = await this.summonerService.findBySummonerName(
        region,
        summonerName,
      );
    }

    const queryBuilder = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.metadata', 'metadata');
    // .where(':summonerPuuid = ANY(metadata.participants)', {
    //   summonerPuuid: summoner.puuid,
    // });
    // .innerJoinAndSelect(
    //   Participant,
    //   'participant',
    //   'participant.metadata_uuid = metadata.uuid',
    // )
    // .innerJoinAndSelect(
    //   Summoner,
    //   'summoner',
    //   'summoner.id = participant.summoner_id',
    // );
    // console.log(queryBuilder.getSql());
    const matches = await queryBuilder.getMany();
    // console.log('matches: ', matches);
    // if (matches.length > 0) {
    //   return matches;
    // }

    const data = await this.riotService.fetchMatchesBySummonerPuuid(
      region,
      summoner.puuid,
    );
    const matchData = await this.riotService.fetchMatchByMatchId(
      region,
      data[0],
    );
    matchData.region = region;

    const summonerParticipant = matchData.info.participants.find(
      (participant) => participant.puuid === summoner.puuid,
    );
    matchData.info.participants = [summonerParticipant];
    const match = await this.insertAllMatchDtos(matchData);
    return match;
    // for (const matchId of data) {
    //   const matchData = await this.riotService.fetchMatchByMatchId(
    //     region,
    //     matchId,
    //   );
    //   console.log('match data: ', matchData);
    //   // const match = this.matchRepository.create(matchData);
    //   // match.region = region;
    //   // const insert = await this.matchRepository.insert(match);
    //   // console.log('insert: ', insert);
    // }
    // if (size) {
    //   query.offset(size);
    // }

    // return query.getMany();
  }

  //   async findBySummonerName(region: string, summonerName: string) {
  //     let summoner = await this.dataSource.manager.findOneBy(Summoner, {
  //       region,
  //       name: summonerName,
  //     });

  //     if (!summoner) {
  //       summoner = await this.summonerService.findBySummonerName(
  //         region,
  //         summonerName,
  //       );
  //     }

  //     const query = this.matchRepository
  //       .createQueryBuilder('match')
  //       .innerJoinAndSelect(MatchInfo, 'info', 'info.uuid = match.info_uuid')
  //       .leftJoinAndSelect('info.participants', 'participants')
  //       .whereExists('match')
  //       .where('match.region = :region', { region: region })
  //       .andWhere('participant.summoner.puuid = :puuid', {
  //         puuid: summoner.puuid,
  //       });

  //     // console.log(query.getSql());

  //     // const result = await query.getMany();
  //     // console.log(result);
  //   }
  // }
}
