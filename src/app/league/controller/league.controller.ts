import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { LeagueService } from '../services/league.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateLeagueDto, UpdateLeagueDto } from '../dto/league.dto';

@ApiTags('League')
@Controller('league')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post(':region')
  create(
    @Param('region') region: string,
    @Body() createLeagueDto: CreateLeagueDto,
  ) {
    return this.leagueService.create(region, createLeagueDto);
  }

  @Get(':region/leagues')
  findAll(@Param('region') region: string) {
    return this.leagueService.findAll(region);
  }

  @Get(':region/:summonerName')
  findBySummonerName(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.leagueService.findBySummonerName(region, summonerName);
  }

  @Get(':region/:summonerName/:queueType')
  findBySummonerAndQueue(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
    @Param('queueType') queueType: string,
  ) {
    return this.leagueService.findBySummonerAndQueue(
      region,
      summonerName,
      queueType,
    );
  }

  @Patch(':region/:leagueId')
  update(
    @Param('region') region: string,
    @Param('leagueId') leagueId: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ) {
    return this.leagueService.update(region, leagueId, updateLeagueDto);
  }

  @Delete(':region/:leagueId')
  remove(@Param('region') region: string, @Param('leagueId') leagueId: string) {
    return this.leagueService.remove(region, leagueId);
  }
}
