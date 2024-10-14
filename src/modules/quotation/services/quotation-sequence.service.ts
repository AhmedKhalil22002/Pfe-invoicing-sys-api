import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AppConfigService } from 'src/common/app-config/services/app-config.service';
import { QuotationSequentialNotFoundException } from '../errors/quotation.sequential.error';
import { AppConfigEntity } from 'src/common/app-config/repositories/entities/app-config.entity';
import { format } from 'date-fns';
import { EventsGateway } from 'src/common/gateways/events/events.gateway';
import { UpdateQuotationSequenceDto } from '../dtos/quotation-seqence.update.dto';
import { QuotationService } from './quotation.service';

@Injectable()
export class QuotationSequenceService {
  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject(forwardRef(() => QuotationService))
    private readonly quotationService: QuotationService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async get(): Promise<AppConfigEntity> {
    const sequence =
      await this.appConfigService.findOneByName('quotation_sequence');
    if (!sequence) {
      throw new QuotationSequentialNotFoundException();
    }
    return sequence;
  }

  async set(
    updateQuotationSequenceDto: UpdateQuotationSequenceDto,
  ): Promise<AppConfigEntity> {
    const sequence = await this.get();
    const updatedSequence = await this.appConfigService.update(sequence.id, {
      value: updateQuotationSequenceDto,
    });
    if (updateQuotationSequenceDto.propagate_changes)
      await this.quotationService.updateAllQuotationSequences();
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
    this.wsGateway.server.emit('quotation-sequence-updated', {
      value: sequence.value,
    });
    return this.formSequential(
      sequence.value.prefix,
      sequence.value.dynamicSequence,
      sequence.value.next,
    );
  }
}
