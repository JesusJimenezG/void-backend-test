import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Challenge,
  Match,
  MatchInfo,
  MatchMetadata,
  Participant,
} from '../entities/match.entity';
import { DataSource, Repository } from 'typeorm';
import { REPOSITORIES } from '../../../shared/constants/constants';
import { Summoner } from '../../summoner/entities/summoner.entity';
import { SummonerService } from '../../summoner/services/summoner.service';
import { RiotAPIService } from '../../riot-api/riot.api.service';
import {
  MatchDto,
  MatchInfoDTO,
  MatchMetadataDTO,
  ParticipantDTO,
  ChallengeDTO,
} from '../dto/match.dto';
import { mapParticipantsToDto } from '../utils/match.service.utils';
import { PageMetaDto } from '../../../shared/pagination/page-meta.dto';
import { PageDto } from '../../../shared/pagination/page.dto';

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
    // Get the match DTOs
    const matchMetadataDto = matchDto.metadata;
    const matchInfoDto = matchDto.info;
    // Insert related data
    const newMetadataDto = await this.insertMetadata(matchMetadataDto);
    const newMatchInfoDto = await this.insertInfo(matchInfoDto);
    // Create the match
    const newMatch = await this.dataSource.manager.create(Match, matchDto);
    await this.dataSource.manager.insert(Match, newMatch);
    // Create the matchDto
    let newMatchDto = new MatchDto();
    newMatchDto = { ...newMatch, ...newMatchDto };
    newMatchDto.metadata = newMetadataDto;
    newMatchDto.info = newMatchInfoDto;
    return newMatchDto;
  }

  async insertMetadata(metadataDto: MatchMetadataDTO) {
    const metadata = await this.dataSource.manager.create(
      MatchMetadata,
      metadataDto,
    );
    await this.dataSource.manager.insert(MatchMetadata, metadata);
    return metadata;
  }

  async insertInfo(infoDto: MatchInfoDTO) {
    // Get the MatchInfo DTOs
    const participantsDto = infoDto.participants;
    // Insert the MatchInfo
    const info = await this.dataSource.manager.create(MatchInfo, infoDto);
    await this.dataSource.manager.insert(MatchInfo, info);
    // Insert the participants
    const participants = await this.insertParticipants(
      participantsDto,
      info.matchId,
    );
    // Create the new MatchInfo DTO
    const newParticipantsDto = mapParticipantsToDto(participants);
    const newInfoDto: MatchInfoDTO = {
      ...info,
      participants: newParticipantsDto,
    };
    return newInfoDto;
  }

  async insertParticipants(
    participantsDto: ParticipantDTO[],
    matchInfoId: string,
  ) {
    // Get the Participant DTOs
    const challengeDto = participantsDto[0].challenges;
    const newChallengeDto = await this.insertChallenges(challengeDto);
    participantsDto[0].challenges = newChallengeDto;
    // Get the the Participant relations
    const summoner = await this.dataSource.manager.findOne(Summoner, {
      where: { id: participantsDto[0].summonerId },
    });
    const matchInfo = await this.dataSource.manager.findOne(MatchInfo, {
      where: { matchId: matchInfoId },
    });
    const participants = await this.dataSource.manager.create(
      Participant,
      participantsDto,
    );
    participants[0].summoner = summoner;
    participants[0].matchInfo = matchInfo;
    // Insert the Participant
    await this.dataSource.manager.insert(Participant, participants);
    return participants;
  }

  async insertChallenges(challengesDto: ChallengeDTO) {
    const challenges = await this.dataSource.manager.create(
      Challenge,
      challengesDto,
    );
    await this.dataSource.manager.insert(Challenge, challenges);
    return challenges;
  }

  findAll(region: string) {
    return this.matchRepository.find({
      where: {
        region: region,
      },
    });
  }

  async findRecentSummonerMatches(
    region: string,
    summonerName: string,
    pageOptionsDto?,
  ) {
    const queueId = pageOptionsDto?.queueId;
    const summoner = await this.summonerService.findBySummonerName(
      region,
      summonerName,
    );

    const query = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.metadata', 'metadata')
      .leftJoinAndSelect('match.info', 'info')
      .leftJoinAndSelect('info.participants', 'participants')
      .where('match.region = :region', { region: region })
      .andWhere(':summonerPuuid = ANY(metadata.participants)', {
        summonerPuuid: summoner.puuid,
      })
      .orderBy('info.gameCreation', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (queueId) {
      query.andWhere('info.queueId = :queueId', { queueId: +queueId });
    }

    const exists = await query.getExists();
    if (exists) {
      const itemCount = await query.getCount();
      const matches = await query.getMany();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      return new PageDto(matches, pageMetaDto);
    }

    let data;
    try {
      data = await this.riotService.fetchMatchesBySummonerPuuid(
        region,
        summoner.puuid,
        0,
        pageOptionsDto.take,
        queueId ? +queueId : undefined,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Could not fetch matches from Riot API',
      );
    }
    for (const matchId of data) {
      await this.matchFromRiot(region, summoner, matchId);
    }
    return this.findRecentSummonerMatches(region, summonerName, pageOptionsDto);
  }

  async findMatchBySummonerNameAndMatchId(
    region: string,
    summonerName: string,
    matchId: string,
  ) {
    const summoner = await this.summonerService.findBySummonerName(
      region,
      summonerName,
    );
    const match = await this.matchRepository.findOne({
      relations: ['metadata', 'info', 'info.participants'],
      where: {
        region,
        matchId: matchId,
      },
    });
    if (match) {
      let matchDto = new MatchDto();
      matchDto = { ...match, ...matchDto };
      matchDto.info.participants = mapParticipantsToDto(
        match.info.participants,
      );
      return matchDto;
    }
    return this.matchFromRiot(region, summoner, matchId);
  }

  async matchFromRiot(region: string, summoner: Summoner, matchId: string) {
    // Retrieve the match from Riot
    const matchData = await this.riotService.fetchMatchByMatchId(
      region,
      matchId,
    );
    // Assign the region and matchId to the match
    matchData.region = region;
    matchData.matchId = matchId;
    matchData.metadata.matchId = matchId;
    matchData.info.matchId = matchId;

    // Filter the participants to only include the summoner
    const summonerParticipant = matchData.info.participants.find(
      (participant) => participant.puuid === summoner.puuid,
    );
    matchData.info.participants = [summonerParticipant];
    // Insert the match into the database
    const insertedMatch = await this.insertAllMatchDtos(matchData);
    return insertedMatch;
  }

  // async insertTeams(teamsDto: TeamDTO[]) {
  //   for (let index = 0; index < teamsDto.length; index++) {
  //     const bansDto = teamsDto[index].bans;
  //     const objectivesDto = teamsDto[index].objectives;

  //     const bans = await this.insertBans(bansDto);
  //     teamsDto[index].bans = bans;
  //     const objectives = await this.insertObjectives(objectivesDto);
  //     teamsDto[index].objectives = objectives;
  //   }
  //   const teams = await this.dataSource.manager.create(Team, teamsDto);
  //   const teamsResult = await this.dataSource.manager.insert(Team, teams);
  //   console.log('teamsResult: ', teamsResult);
  //   return teams;
  // }

  // async insertObjectives(objectivesDto: ObjectivesDTO) {
  //   for (const keys of Object.keys(objectivesDto)) {
  //     const objectiveDto: ObjectiveDTO = objectivesDto[keys];

  //     const objective = await this.insertObjective(objectiveDto);
  //     objectivesDto[keys] = objective;
  //   }
  //   const objectives = await this.dataSource.manager.create(
  //     Objectives,
  //     objectivesDto,
  //   );
  //   const objectivesResult = await this.dataSource.manager.insert(
  //     Objectives,
  //     objectives,
  //   );
  //   console.log('objectivesResult: ', objectivesResult);
  //   return objectives;
  // }

  // async insertObjective(objectiveDto: ObjectiveDTO) {
  //   const objective = await this.dataSource.manager.create(
  //     Objective,
  //     objectiveDto,
  //   );
  //   const objectivesResult = await this.dataSource.manager.insert(
  //     Objective,
  //     objective,
  //   );
  //   console.log('objectivesResult: ', objectivesResult);
  //   return objective;
  // }
}
