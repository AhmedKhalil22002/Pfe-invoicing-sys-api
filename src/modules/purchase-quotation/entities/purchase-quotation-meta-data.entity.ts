import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseQuotationEntity } from './purchase-quotation.entity';

@Entity('purchase-quotation_meta_data')
export class PurchaseQuotationMetaDataEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PurchaseQuotationEntity, (purchaseQuotation) => purchaseQuotation.purchaseQuotationMetaData)
  purchaseQuotation: PurchaseQuotationEntity;

  @Column({ type: 'boolean', default: true })
  showInvoiceAddress: boolean;

  @Column({ type: 'boolean', default: true })
  showDeliveryAddress: boolean;

  @Column({ type: 'boolean', default: true })
  showArticleDescription: boolean;

  @Column({ type: 'boolean', default: true })
  hasBankingDetails: boolean;

  @Column({ type: 'boolean', default: true })
  hasGeneralConditions: boolean;

  @Column({ type: 'json', nullable: true })
  taxSummary: any;
}
