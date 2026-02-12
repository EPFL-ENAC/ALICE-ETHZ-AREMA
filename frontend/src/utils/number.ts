function toLocalizedNumber(value: number | string | undefined, options?: Intl.NumberFormatOptions) {
  if (value === undefined) return undefined;
  const number = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(number)) return undefined;
  return new Intl.NumberFormat(undefined, options).format(number);
}

export { toLocalizedNumber };
