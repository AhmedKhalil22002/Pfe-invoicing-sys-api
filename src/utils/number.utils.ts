export const approximateNumber = (
  number: number,
  digitsAfterComma: number = 2,
) => {
  return Number(number.toFixed(digitsAfterComma));
};
