export const approximateNumber = (
  value: number,
  digitsAfterComma: number = 2,
) => {
  const factor = Math.pow(10, digitsAfterComma);
  return Math.round(value * factor) / factor;
};
