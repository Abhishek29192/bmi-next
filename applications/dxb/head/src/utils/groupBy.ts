const groupBy = <T extends Record<string, unknown>>(
  array: readonly T[],
  field: keyof T | ((t: T) => string)
) =>
  array.reduce<{ [key: string]: T[] }>((grouped, value) => {
    if (typeof field === "function") {
      (grouped[field(value)] || (grouped[field(value)] = [])).push(value);
    } else {
      // eslint-disable-next-line security/detect-object-injection
      (grouped[`${value[field]}`] || (grouped[`${value[field]}`] = [])).push(
        value
      );
    }
    return grouped;
  }, {});

export default groupBy;
