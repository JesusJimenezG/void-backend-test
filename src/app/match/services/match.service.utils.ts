import { ParticipantDTO } from '../dto/match.dto';

export const mapParticipantsToDto = (participants: any[]) => {
  const newParticipantsDto: ParticipantDTO[] = [];
  participants.map((participant) => {
    const { summoner, team, ...newParticipantDto } = Object.assign(
      {},
      participant,
      {
        summoner: undefined,
      },
      { team: undefined },
    );
    newParticipantDto.puuid = participant.summoner.puuid;
    newParticipantDto.summonerId = participant.summoner.id;
    newParticipantDto.summonerName = participant.summoner.name;
    newParticipantDto.summonerLevel = participant.summoner.summonerLevel;
    newParticipantDto.teamId = participant.team.teamId;

    newParticipantsDto.push(newParticipantDto);
  });
  return newParticipantsDto;
};
