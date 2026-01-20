import { ParticipantDTO } from '../dto/match.dto';

export const mapParticipantsToDto = (participants: any[]) => {
  const newParticipantsDto: ParticipantDTO[] = [];
  participants.map((participant) => {
    const newParticipantDto = { ...participant };
    delete newParticipantDto.summoner;
    delete newParticipantDto.matchInfo;

    newParticipantDto.puuid = participant.summoner?.puuid || participant.puuid;
    newParticipantDto.summonerId =
      participant.summoner?.id || participant.summonerId;
    newParticipantDto.summonerName =
      participant.summoner?.name || participant.summonerName;
    newParticipantDto.summonerLevel =
      participant.summoner?.summonerLevel || participant.summonerLevel;
    newParticipantDto.riotIdGameName =
      participant.riotIdGameName || participant.summoner?.gameName;
    newParticipantDto.riotIdTagline =
      participant.riotIdTagline || participant.summoner?.tagLine;
    newParticipantsDto.push(newParticipantDto);
  });
  return newParticipantsDto;
};
