const setPrecision = (value, decimalPlaces = 2) => {
  const floatValue = parseFloat(value);
  if (floatValue === 0) return 0;
  const c = Math.pow(10, decimalPlaces);
  return Math.round(floatValue * c) / c;
};

export { setPrecision };
