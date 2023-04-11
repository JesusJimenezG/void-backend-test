import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LeagueService } from '../service/league.service';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { UpdateLeagueDto } from '../dto/update-league.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('League')
@Controller('league')
export class LeagueController {
  constructor(private readonly leagueService: LeagueService) {}

  @Post()
  create(@Body() createLeagueDto: CreateLeagueDto) {
    return this.leagueService.create(createLeagueDto);
  }

  // @Get()
  // findAll() {
  //   return this.leagueService.findAll();
  // }

  @Get(':region/:summonerId')
  findOne(
    @Param('region') region: string,
    @Param('summonerId') summonerId: string,
  ) {
    return this.leagueService.findOne(region, summonerId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLeagueDto: UpdateLeagueDto) {
  //   return this.leagueService.update(+id, updateLeagueDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.leagueService.remove(+id);
  // }
}
