import { ParticipantDTO } from '../dto/match.dto';

export const mapParticipantsToDto = (participants: any[]) => {
  const newParticipantsDto: ParticipantDTO[] = [];
  participants.map((participant) => {
    const { summoner, matchInfo, ...newParticipantDto } = Object.assign(
      {},
      participant,
      { summoner: undefined },
      { matchInfo: undefined },
    );
    newParticipantDto.puuid = participant.summoner.puuid;
    newParticipantDto.summonerId = participant.summoner.id;
    newParticipantDto.summonerName = participant.summoner.name;
    newParticipantDto.summonerLevel = participant.summoner.summonerLevel;
    newParticipantsDto.push(newParticipantDto);
  });
  return newParticipantsDto;
};
