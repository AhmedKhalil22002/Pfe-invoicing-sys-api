import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import { LineItem } from '../interfaces/line-item.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoicingCalculationsService {
  constructor() {}
  //calulate subtotal for a line item
  calculateSubTotalForLineItem(lineItem: LineItem) {
    const { quantity, unit_price, discount, discount_type } = lineItem;
    let subTotal = quantity * unit_price;
    console.log('subTotal', subTotal);
    if (discount_type === DISCOUNT_TYPES.AMOUNT) {
      subTotal -= discount;
    } else if (discount_type === DISCOUNT_TYPES.PERCENTAGE) {
      subTotal -= (subTotal * discount) / 100;
    }
    return subTotal;
  }

  //calculate total for a line item
  calculateTotalForLineItem(lineItem: LineItem) {
    const { taxes } = lineItem;
    const subTotal = this.calculateSubTotalForLineItem(lineItem);
    let taxAmount = 0;
    let specialTaxAmount = 0;
    for (const tax of taxes) {
      if (tax.isSpecial) specialTaxAmount += tax.rate;
      else taxAmount += tax.rate;
    }
    const total = subTotal * (1 + taxAmount) * (1 + specialTaxAmount);
    return total;
  }

  //calculate subtotal and total for a line items after individual line items are calculated
  calculateLineItemsTotal(totals: number[], subTotals: number[]) {
    const subTotal = subTotals.reduce((total, current) => total + current, 0);
    const total = totals.reduce((total, current) => total + current, 0);
    return { subTotal, total };
  }

  calculateTotalDiscountAndTaxStamp(
    total: number,
    discount: number,
    discount_type: DISCOUNT_TYPES,
    taxStamp: number,
    applyDiscountAfter: boolean = true,
  ): number {
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
