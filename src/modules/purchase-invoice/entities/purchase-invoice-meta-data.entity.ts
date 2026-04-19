import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchaseInvoiceEntity } from './purchase-invoice.entity';

@Entity('purchase_invoice_meta_data')
export class PurchaseInvoiceMetaDataEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PurchaseInvoiceEntity, (invoice) => invoice.purchaseInvoiceMetaData)
  purchaseInvoice: PurchaseInvoiceEntity;

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

  @Column({ type: 'boolean', default: true })
  hasTaxStamp: boolean;

  @Column({ type: 'boolean', default: true })
  hasTaxWithholding: boolean;

  @Column({ type: 'json', nullable: true })
  taxSummary: any;
}
