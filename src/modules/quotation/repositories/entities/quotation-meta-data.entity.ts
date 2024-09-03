import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuotationEntity } from './quotation.entity';

@Entity('quotation_meta_data')
export class QuotationMetaDataEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => QuotationEntity, (quotation) => quotation.quotationMetaData)
  quotation: QuotationEntity;

  @Column({ type: 'boolean', default: true })
  showInvoiceAddress: boolean;

  @Column({ type: 'boolean', default: true })
  showDeliveryAddress: boolean;

  @Column({ type: 'json', nullable: true })
  taxSummary: any;
}
