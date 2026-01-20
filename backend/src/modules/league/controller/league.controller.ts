import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { LeagueService } from '../services/league.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateLeagueDto, UpdateLeagueDto } from '../dto/league.dto';
import { RegionInterceptor } from '../../../shared/interceptors/region.interceptor';

@ApiTags('League')
@Controller('league')
@UseInterceptors(RegionInterceptor)
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

  @Get(':region/:gameName/:tagLine')
  findByRiotId(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Query('queueId') queueId?: string,
  ) {
    return this.leagueService.findByRiotId(region, gameName, tagLine, queueId);
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
