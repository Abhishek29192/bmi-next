const getPitchValues = (dimensions: Record<string, string>) =>
  Object.keys(dimensions)
    .filter((key) => key.startsWith("P"))
    .map((key) => parseFloat(dimensions[key]));

export default getPitchValues;
