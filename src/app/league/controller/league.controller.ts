import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { LeagueService } from '../service/league.service';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateLeagueDto } from '../dto/update-league.dto';

@ApiTags('League')
@Controller('league')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leagueService.create(createLeagueDto);
  }

  @Get(':region/:summonerId')
  findAll(
    @Param('region') region: string,
    @Param('summonerId') summonerId: string,
  ) {
    return this.leagueService.findAll(region, summonerId);
  }

  @Patch(':leagueId')
  update(
    @Param('leagueId') leagueId: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ) {
    return this.leagueService.update(leagueId, updateLeagueDto);
  }

  @Delete(':leagueId')
  remove(@Param('leagueId') leagueId: string) {
    return this.leagueService.remove(leagueId);
  }
}
