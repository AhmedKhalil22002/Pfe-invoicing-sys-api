import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';

type Tax = {
  rate: number;
};

type LineItem = {
  quantity: number;
  unit_price: number;
  discount: number;
  discount_type: 'amount' | 'percentage';
  taxes: Tax[];
};

export class InvoicingCalculationsService {
  private static calculateSubTotalForLineItem(lineItem: LineItem) {
    const { quantity, unit_price, discount, discount_type } = lineItem;
    let subTotal = quantity * unit_price;
    if (discount_type === 'amount') {
      subTotal -= discount;
    } else if (discount_type === 'percentage') {
      subTotal -= (subTotal * discount) / 100;
    }
    return subTotal;
  }

  private static calculateTotalForLineItem(lineItem: LineItem) {
    const { taxes } = lineItem;
    const subTotal = this.calculateSubTotalForLineItem(lineItem);
    let taxAmount = 0;
    for (const tax of taxes) {
      taxAmount += (subTotal * tax.rate) / 100;
    }
    const total = subTotal + taxAmount;
    return total;
  }

  static calculateLineItemsTotal(lineItems: LineItem[]) {
    const subTotal = lineItems.reduce(
      (total, lineItem) => total + this.calculateSubTotalForLineItem(lineItem),
      0,
    );
    const total = lineItems.reduce(
      (total, lineItem) => total + this.calculateTotalForLineItem(lineItem),
      0,
    );
    return { subTotal, total };
  }
  static calculateTotalDiscountAndTaxStamp(
    total: number,
    discount: number,
    discount_type: DISCOUNT_TYPES,
    taxStamp: number,
    applyDiscountAfter: boolean = false,
  ): number {
    console.log(`Initial total: ${total}`);
    console.log(`Discount: ${discount}`);
    console.log(`Discount type: ${discount_type}`);
    console.log(`Tax Stamp: ${taxStamp}`);
    console.log(`Apply discount after tax stamp: ${applyDiscountAfter}`);
    let discountAmount = 0;

    if (discount_type === DISCOUNT_TYPES.AMOUNT) {
      discountAmount = discount;
    } else {
      discountAmount = (total * discount) / 100;
    }

    if (applyDiscountAfter) {
      total -= taxStamp;
      total -= discountAmount;
    } else {
      total -= discountAmount;
      total -= taxStamp;
    }

    return total;
  }
}
