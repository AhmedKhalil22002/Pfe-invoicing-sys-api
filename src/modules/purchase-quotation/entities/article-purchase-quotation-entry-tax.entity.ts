import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { ArticlePurchaseQuotationEntryEntity } from './article-purchase-quotation-entry.entity';
import { TaxEntity } from 'src/modules/tax/entities/tax.entity';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';

@Entity('article_purchase_quotation_entry_tax')
export class ArticlePurchaseQuotationEntryTaxEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ArticlePurchaseQuotationEntryEntity)
  @JoinColumn({ name: 'articlePurchaseQuotationEntryId' })
  articlePurchaseQuotationEntry: ArticlePurchaseQuotationEntryEntity;

  @Column({ type: 'int' })
  articlePurchaseQuotationEntryId: number;

  @ManyToOne(() => TaxEntity)
  @JoinColumn({ name: 'taxId' })
  tax: TaxEntity;

  @Column({ type: 'int' })
  taxId: number;
}
