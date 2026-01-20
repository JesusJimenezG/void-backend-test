import { Inject, Injectable } from '@nestjs/common';
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
    // Check if match already exists to avoid duplicate key error
    await this.dataSource.manager.findOne(Match, {
      where: { matchId: matchDto.matchId },
    });
    // We used to return early here, but we should proceed to ensure
    // MatchInfo and Participants are synced even if the Match entity exists.

    // Get the match DTOs
    const matchMetadataDto = matchDto.metadata;
    const matchInfoDto = matchDto.info;

    // Insert or Get related data
    let newMetadataDto = await this.dataSource.manager.findOne(MatchMetadata, {
      where: { matchId: matchMetadataDto.matchId },
    });
    if (!newMetadataDto) {
      newMetadataDto = await this.insertMetadata(matchMetadataDto);
    }

    let newMatchInfoDto = await this.dataSource.manager.findOne(MatchInfo, {
      where: { matchId: matchInfoDto.matchId },
      relations: [
        'participants',
        'participants.challenges',
        'participants.summoner',
      ],
    });

    if (!newMatchInfoDto) {
      newMatchInfoDto = await this.insertInfo(matchInfoDto);
    }

    // Create the match
    const newMatch = await this.dataSource.manager.create(Match, matchDto);
    newMatch.metadata = newMetadataDto;
    newMatch.info = newMatchInfoDto;

    try {
      await this.dataSource.manager.insert(Match, newMatch);
    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        throw error;
      }
    }

    // Create the matchDto
    let newMatchDto = new MatchDto();
    newMatchDto = { ...newMatch, ...newMatchDto };
    newMatchDto.metadata = newMetadataDto;

    // Handle participants mapping
    if (
      newMatchInfoDto.participants &&
      newMatchInfoDto.participants.length > 0
    ) {
      newMatchDto.info = {
        ...newMatchInfoDto,
        participants: mapParticipantsToDto(newMatchInfoDto.participants),
      } as MatchInfoDTO;
    } else {
      newMatchDto.info = newMatchInfoDto as unknown as MatchInfoDTO;
    }

    return newMatchDto;
  }

  async insertMetadata(metadataDto: MatchMetadataDTO) {
    const existing = await this.dataSource.manager.findOne(MatchMetadata, {
      where: { matchId: metadataDto.matchId },
    });
    if (existing) return existing;

    const metadata = await this.dataSource.manager.create(
      MatchMetadata,
      metadataDto,
    );
    try {
      await this.dataSource.manager.insert(MatchMetadata, metadata);
    } catch (error) {
      // Race condition check
      if (error.message.includes('duplicate key')) {
        return await this.dataSource.manager.findOne(MatchMetadata, {
          where: { matchId: metadataDto.matchId },
        });
      }
      throw error;
    }
    return metadata;
  }

  async insertInfo(infoDto: MatchInfoDTO) {
    const existingInfo = await this.dataSource.manager.findOne(MatchInfo, {
      where: { matchId: infoDto.matchId },
      relations: [
        'participants',
        'participants.challenges',
        'participants.summoner',
      ],
    });
    if (existingInfo) {
      // If info exists, we might need to append the new participant if it's not there.
      // Current logic seems to process one participant at a time for the summoner being queried.
      const participantDto = infoDto.participants[0];
      const existingParticipant = existingInfo.participants.find(
        (p) => p.summoner?.puuid === participantDto.puuid,
      );

      if (!existingParticipant) {
        // Insert participant only
        await this.insertParticipants(infoDto.participants, infoDto.matchId);
        // Re-fetch to return complete info? Or just return existing with new participant implied.
      }
      return existingInfo as unknown as MatchInfoDTO; // Return existing (with potentially new participant added separately)
    }

    // Get the MatchInfo DTOs
    const participantsDto = infoDto.participants;
    // Insert the MatchInfo
    const info = await this.dataSource.manager.create(MatchInfo, infoDto);
    try {
      await this.dataSource.manager.insert(MatchInfo, info);
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        // If failed to insert info, it means it was created concurrently.
        // Recurse to handle "existing" case.
        return this.insertInfo(infoDto);
      }
      throw error;
    }

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
      where: { puuid: participantsDto[0].puuid },
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
    gameName: string,
    tagLine: string,
    pageOptionsDto?,
  ) {
    const queueIdRaw = pageOptionsDto?.queueId;
    // Parse queueId - only use it if it's a valid number (not "ALL" or other strings)
    const queueId =
      queueIdRaw && queueIdRaw !== 'ALL' && !isNaN(+queueIdRaw)
        ? +queueIdRaw
        : undefined;

    const summoner = await this.summonerService.findByRiotId(
      region,
      gameName,
      tagLine,
    );

    // FIX: Always try to fetch recent matches from Riot to keep DB fresh
    // Only do this for the first page to avoid excessive API calls on pagination
    if (!pageOptionsDto.skip || pageOptionsDto.skip === 0) {
      try {
        const riotMatchIds = await this.riotService.fetchMatchesBySummonerPuuid(
          region,
          summoner.puuid,
          0,
          pageOptionsDto.take || 10,
          queueId,
        );

        // Sync matches that don't exist in DB OR participant record is missing for this summoner
        for (const matchId of riotMatchIds) {
          const participantExists = await this.dataSource.manager.findOne(
            Participant,
            {
              where: {
                matchInfo: { matchId },
                summoner: { puuid: summoner.puuid },
              },
            },
          );

          if (!participantExists) {
            await this.matchFromRiot(region, summoner, matchId);
          }
        }
      } catch (error) {
        console.error('Failed to sync matches from Riot API:', error);
        // Continue to serve from DB if Riot API fails
      }
    }

    const query = this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.metadata', 'metadata')
      .leftJoinAndSelect('match.info', 'info')
      .leftJoinAndSelect('info.participants', 'participants')
      .leftJoinAndSelect('participants.summoner', 'summoner')
      .where('match.region = :region', { region: region })
      .andWhere(':summonerPuuid = ANY(metadata.participants)', {
        summonerPuuid: summoner.puuid,
      })
      .orderBy('info.gameCreation', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (queueId !== undefined) {
      query.andWhere('info.queueId = :queueId', { queueId });
    }

    const itemCount = await query.getCount();
    const matches = await query.getMany();

    const mappedMatches = matches.map((match) => {
      const matchDto = new MatchDto();
      Object.assign(matchDto, match);
      if (match.info && match.info.participants) {
        matchDto.info.participants = mapParticipantsToDto(
          match.info.participants,
        );
      }
      return matchDto;
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(mappedMatches, pageMetaDto);
  }

  async findMatchByRiotIdAndMatchId(
    region: string,
    gameName: string,
    tagLine: string,
    matchId: string,
  ) {
    const summoner = await this.summonerService.findByRiotId(
      region,
      gameName,
      tagLine,
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
