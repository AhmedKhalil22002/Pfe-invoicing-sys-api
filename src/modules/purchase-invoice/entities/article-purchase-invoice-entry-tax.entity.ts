import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { TaxEntity } from 'src/modules/tax/entities/tax.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { ArticlePurchaseInvoiceEntryEntity } from './article-purchase-invoice-entry.entity';

@Entity('article-purchase-invoice-entry-tax')
export class ArticlePurchaseInvoiceEntryTaxEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ArticlePurchaseInvoiceEntryEntity)
  @JoinColumn({ name: 'articlePurchaseInvoiceEntryId' })
  articlePurchaseInvoiceEntry: ArticlePurchaseInvoiceEntryEntity;

  @Column({ type: 'int' })
  articlePurchaseInvoiceEntryId: number;

  @ManyToOne(() => TaxEntity)
  @JoinColumn({ name: 'taxId' })
  tax: TaxEntity;

  @Column({ type: 'int' })
  taxId: number;
}
