const getMeasurement = (
  values: Record<string, string>,
  measurement: string
): number => {
  // eslint-disable-next-line security/detect-object-injection
  if (!values[measurement]) {
    return 0;
  }
  // eslint-disable-next-line security/detect-object-injection
  return parseFloat(values[measurement]);
};

export default getMeasurement;
