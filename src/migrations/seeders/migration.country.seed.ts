import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { CountryService } from 'src/modules/country/services/country.service';
import { countries } from '../data/country.data';

@Injectable()
export class MigrationCountrySeed {
  constructor(private readonly countryService: CountryService) {}

  @Command({
    command: 'seed:country',
    describe: 'seeds countries',
  })
  async seeds(): Promise<void> {
    try {
      await this.countryService.saveMany(countries);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'rollback:country',
    describe: 'rollback country',
  })
  async remove(): Promise<void> {
    try {
      await this.countryService.deleteAll();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
