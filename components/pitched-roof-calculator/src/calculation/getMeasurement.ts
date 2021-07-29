const getMeasurement = (
  values: Record<string, string>,
  measurement: string
): number => {
  // eslint-disable-next-line security/detect-object-injection
  if (!values[measurement]) {
    throw new Error(`Unable to find measurement for ${measurement}`);
  }
  // eslint-disable-next-line security/detect-object-injection
  return parseFloat(values[measurement]);
};

export default getMeasurement;
