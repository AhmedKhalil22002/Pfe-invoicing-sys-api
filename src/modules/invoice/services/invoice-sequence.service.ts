import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/common/app-config/services/app-config.service';
import { AppConfigEntity } from 'src/common/app-config/repositories/entities/app-config.entity';
import { format } from 'date-fns';
import { EventsGateway } from 'src/common/gateways/events/events.gateway';
import { UpdateInvoiceSequenceDto } from '../dtos/invoice-seqence.update.dto';
import { InvoiceSequentialNotFoundException } from '../errors/invoice-sequential.error';

@Injectable()
export class InvoiceSequenceService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async get(): Promise<AppConfigEntity> {
    const sequence =
      await this.appConfigService.findOneByName('invoice_sequence');
    if (!sequence) {
      throw new InvoiceSequentialNotFoundException();
    }
    return sequence;
  }

  async set(
    updateInvoiceSequenceDto: UpdateInvoiceSequenceDto,
  ): Promise<AppConfigEntity> {
    const sequence = await this.get();
    const updatedSequence = await this.appConfigService.update(sequence.id, {
      value: updateInvoiceSequenceDto,
    });
    return updatedSequence;
  }

  //helper function to format the sequence
  formSequential(
    prefix: string,
    dynamicSequence: any,
    next: number,
    date: Date = new Date(),
  ): string {
    return `${prefix}-${format(date, dynamicSequence)}-${next}`;
  }

  async getSequential(): Promise<string> {
    const sequence = await this.get();
    this.set({ ...sequence.value, next: sequence.value.next + 1 });
    this.wsGateway.server.emit('invoice-sequence-updated', {
      value: sequence.value,
    });
    return this.formSequential(
      sequence.value.prefix,
      sequence.value.dynamicSequence,
      sequence.value.next,
    );
  }
}
