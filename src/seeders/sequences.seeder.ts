import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { SequenceService } from 'src/modules/sequence/services/sequence.service';
import { Sequences } from 'src/app/enums/sequences.enum';
import { DateFormat } from 'src/modules/sequence/enums/date-format.enum';

@Injectable()
export class SequencesSeederCommand {
  constructor(private readonly sequenceService: SequenceService) {}

  @Command({
    command: 'seed:sequences',
    describe: 'seed system sequences',
  })
  async seed() {
    const start = new Date();
    console.log('Starting seeding of sequences');

    await Promise.all(
      Object.keys(Sequences).map(async (sequence) => {
        const existingSequence =
          await this.sequenceService.findByLabel(sequence);
        if (!existingSequence) {
          await this.sequenceService.save({
            label: sequence,
            prefix: sequence.slice(0, 3).toUpperCase(),
            dateFormat: DateFormat.YYYY,
            next: 1,
          });
        }
      }),
    );

    const end = new Date();
    console.log(`Seeding completed in ${end.getTime() - start.getTime()}ms`);
  }
}
