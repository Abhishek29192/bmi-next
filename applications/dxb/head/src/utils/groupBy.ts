const groupBy = <T extends {}>(
  array: readonly T[],
  field: keyof T | ((t: T) => string)
) =>
  array.reduce<{ [key: string]: T[] }>((grouped, value) => {
    if (typeof field === "function") {
      (grouped[field(value)] || (grouped[field(value)] = [])).push(value);
    } else {
      (grouped[`${value[field]}`] || (grouped[`${value[field]}`] = [])).push(
        value
      );
    }
    return grouped;
  }, {});

export default groupBy;
