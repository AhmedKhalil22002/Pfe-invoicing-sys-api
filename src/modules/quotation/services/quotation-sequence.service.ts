import { Injectable } from '@nestjs/common';
import { QuotationSequentialNotFoundException } from '../errors/quotation.sequential.error';
import { EventsGateway } from 'src/shared/gateways/events/events.gateway';
import { UpdateQuotationSequenceDto } from '../dtos/quotation-seqence.update.dto';
import { formSequential } from 'src/modules/sequence/utils/sequence.utils';
import { WSRoom } from 'src/app/enums/ws-room.enum';
import { SequenceService } from 'src/modules/sequence/services/sequence.service';
import { Sequences } from 'src/app/enums/sequences.enum';
import { SequenceEntity } from 'src/modules/sequence/entities/sequence.entity';

@Injectable()
export class QuotationSequenceService {
  constructor(
    private readonly sequenceService: SequenceService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async get(): Promise<SequenceEntity> {
    const sequence = await this.sequenceService.findByLabel(
      Sequences.QUOTATION,
    );
    if (!sequence) {
      throw new QuotationSequentialNotFoundException();
    }
    return sequence;
  }

  async set(
    updateQuotationSequenceDto: UpdateQuotationSequenceDto,
  ): Promise<SequenceEntity> {
    const sequence = await this.get();
    const updatedSequence = await this.sequenceService.update(
      sequence.id,
      updateQuotationSequenceDto,
    );
    return updatedSequence;
  }
  async getSequential(): Promise<string> {
    const sequence = await this.get();
    this.set({
      prefix: sequence.prefix,
      dateFormat: sequence.dateFormat,
      next: sequence.next + 1,
    });
    this.wsGateway.sendToRoom(
      WSRoom.QUOTATION_SEQUENCE,
      'quotation-sequence-updated',
      { value: sequence.next + 1 },
    );
    return formSequential(sequence.prefix, sequence.dateFormat, sequence.next);
  }
}
