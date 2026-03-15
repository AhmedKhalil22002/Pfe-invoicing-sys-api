import { Injectable } from '@nestjs/common';
import { EventsGateway } from 'src/shared/gateways/events/events.gateway';
import { UpdateInvoiceSequenceDto } from '../dtos/invoice-seqence.update.dto';
import { InvoiceSequentialNotFoundException } from '../errors/invoice-sequential.error';
import { formSequential } from 'src/modules/sequence/utils/sequence.utils';
import { WSRoom } from 'src/app/enums/ws-room.enum';
import { SequenceService } from 'src/modules/sequence/services/sequence.service';
import { Sequences } from 'src/app/enums/sequences.enum';
import { SequenceEntity } from 'src/modules/sequence/entities/sequence.entity';
@Injectable()
export class InvoiceSequenceService {
  constructor(
    private readonly sequenceService: SequenceService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async get(): Promise<SequenceEntity> {
    const sequence = await this.sequenceService.findByLabel(Sequences.INVOICE);
    if (!sequence) {
      throw new InvoiceSequentialNotFoundException();
    }
    return sequence;
  }

  async set(
    updateInvoiceSequenceDto: UpdateInvoiceSequenceDto,
  ): Promise<SequenceEntity> {
    const sequence = await this.get();
    const updatedSequence = await this.sequenceService.update(
      sequence.id,
      updateInvoiceSequenceDto,
    );
    return updatedSequence;
  }

  async getSequential(): Promise<string> {
    const sequence = await this.get();
    this.set({
      ...sequence,
      next: sequence.next + 1,
    });
    this.wsGateway.sendToRoom(
      WSRoom.INVOICE_SEQUENCE,
      'invoice-sequence-updated',
      { value: sequence.next + 1 },
    );
    return formSequential(sequence.prefix, sequence.dateFormat, sequence.next);
  }
}
