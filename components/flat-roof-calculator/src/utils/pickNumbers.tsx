const getNumber = (value: any) =>
  typeof value === "number"
    ? value
    : parseFloat(typeof value === "string" ? value : "") ||
      undefined; /* Avoid having NaN */

export const pickNumbers = <T extends object, K extends keyof T>(
  obj: T,
  ...options: K[]
) =>
  options.reduce(
    (acc, v) => ({
      ...acc,
      // eslint-disable-next-line security/detect-object-injection
      [v]: getNumber(obj[v])
    }),
    {}
  ) as {
    [F in K]: number | undefined;
  };
