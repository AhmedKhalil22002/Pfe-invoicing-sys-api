import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { ArticleEntity } from 'src/modules/article/entities/article.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ArticlePurchaseInvoiceEntryTaxEntity } from './article-purchase-invoice-entry-tax.entity';
import { PurchaseInvoiceEntity } from './purchase-invoice.entity';

@Entity('article-purchase-invoice-entry')
export class ArticlePurchaseInvoiceEntryEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: true })
  unit_price: number;

  @Column({ type: 'float', nullable: true })
  quantity: number;

  @Column({ type: 'float', nullable: true })
  discount: number;

  @Column({ type: 'enum', enum: DISCOUNT_TYPES, nullable: true })
  discount_type: DISCOUNT_TYPES;

  @Column({ type: 'float', nullable: true })
  subTotal: number;

  @Column({ type: 'float', nullable: true })
  total: number;

  @ManyToOne(() => ArticleEntity)
  @JoinColumn({ name: 'articleId' })
  article: ArticleEntity;

  @Column({ type: 'int', nullable: true })
  articleId: number;

  @ManyToOne(() => PurchaseInvoiceEntity)
  @JoinColumn({ name: 'purchaseInvoiceId' })
  purchaseInvoice: PurchaseInvoiceEntity;

  @Column({ type: 'int', nullable: true })
  purchaseInvoiceId: number;

  @OneToMany(
    () => ArticlePurchaseInvoiceEntryTaxEntity,
    (articlePurchaseInvoiceEntryTax) => articlePurchaseInvoiceEntryTax.articlePurchaseInvoiceEntry,
  )
  articlePurchaseInvoiceEntryTaxes: ArticlePurchaseInvoiceEntryTaxEntity[];
}
