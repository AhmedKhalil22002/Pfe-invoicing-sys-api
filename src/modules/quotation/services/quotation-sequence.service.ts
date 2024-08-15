import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/common/app-config/services/app-config.service';
import { QuotationSequentialNotFoundException } from '../errors/quotation.sequential.error';
import { QuotationSequence } from '../interfaces/quotation-sequence.interface';
import { AppConfigEntity } from 'src/common/app-config/repositories/entities/app-config.entity';
import { format } from 'date-fns';
import { EventsGateway } from 'src/common/gateways/events/events.gateway';

@Injectable()
export class QuotationSequenceService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async get(): Promise<AppConfigEntity> {
    const sequence =
      await this.appConfigService.findOneByName('quotation-sequence');
    if (!sequence) {
      throw new QuotationSequentialNotFoundException();
    }
    return sequence;
  }

  async set(quotationSequence: QuotationSequence): Promise<AppConfigEntity> {
    const sequence = await this.get();
    return await this.appConfigService.update(sequence.id, {
      value: quotationSequence,
    });
  }

  async getSequential(): Promise<string> {
    const sequence = await this.get();
    this.set({ ...sequence.value, next: sequence.value.next + 1 });
    this.wsGateway.server.emit('quotation-sequence-updated', {
      value: sequence.value,
    });
    return `${sequence.value.prefix}-${format(
      new Date(),
      sequence.value.dynamicSequence,
    )}-${sequence.value.next}`;
  }
}
