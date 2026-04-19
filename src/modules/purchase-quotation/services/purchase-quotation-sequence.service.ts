import { Injectable } from '@nestjs/common';
import { PurchaseQuotationSequentialNotFoundException } from '../errors/purchase-quotation.sequential.error';
import { EventsGateway } from 'src/shared/gateways/events/events.gateway';
import { UpdatePurchaseQuotationSequenceDto } from '../dtos/purchase-quotation-seqence.update.dto';
import { formSequential } from 'src/modules/sequence/utils/sequence.utils';
import { WSRoom } from 'src/app/enums/ws-room.enum';
import { SequenceService } from 'src/modules/sequence/services/sequence.service';
import { Sequences } from 'src/app/enums/sequences.enum';
import { SequenceEntity } from 'src/modules/sequence/entities/sequence.entity';

@Injectable()
export class PurchaseQuotationSequenceService {
  constructor(
    private readonly sequenceService: SequenceService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async get(): Promise<SequenceEntity> {
    const sequence = await this.sequenceService.findByLabel(
      Sequences.PURCHASE_QUOTATION,
    );
    if (!sequence) {
      throw new PurchaseQuotationSequentialNotFoundException();
    }
    return sequence;
  }

  async set(
    updatePurchaseQuotationSequenceDto: UpdatePurchaseQuotationSequenceDto,
  ): Promise<SequenceEntity> {
    const sequence = await this.get();
    const updatedSequence = await this.sequenceService.update(
      sequence.id,
      updatePurchaseQuotationSequenceDto,
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
      WSRoom.PURCHASE_QUOTATION_SEQUENCE,
      'purchase-quotation-sequence-updated',
      { value: sequence.next + 1 },
    );
    return formSequential(sequence.prefix, sequence.dateFormat, sequence.next);
  }
}
