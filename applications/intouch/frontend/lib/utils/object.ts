import set from "lodash/set";

/**
 * // TODO: improve this description...
 *
 * Returns an object mapping values at paths of keys of input ("a.b.c"), e.g.:
 *
 * spreadObjectKeys({
 *    name: "Joe",
 *    address.firstLine: "Street name"
 * })
 *
 * Returns: {
 *    name: "Joe",
 *    address: {
 *      firstLine: "Street name"
 *    }
 * }
 *
 * @param parseValueCallback allows to modify the returned value. Returning `undefined` skips that key.
 */
export const spreadObjectKeys = (
  values: Record<string, any>,
  parseValueCallback: (k: string, v: any) => any = (k, v) => v
) => {
  return Object.entries(values).reduce<any>((obj, [key, value]) => {
    value = parseValueCallback(key, value);

    if (value === undefined) {
      return obj;
    }

    return set(obj, key, value);
  }, {});
};

/**
 * Returns a new array which is the result of merging 2nd array's objects onto first array by a specified key.
 *
 * mergeByKey(
 *  [{ id: 1, foo: "Bar", success: true }],
 *  [{ id: 1, foo: "Baz" }],
 *  "id"
 * )
 *
 * Returns: [
 *  [{ id: 1, foo: "Baz", success: true }]
 * ]
 */
// TODO: Needs tests
export const mergeByKey = <T extends Record<string, unknown>>(
  arrA: ReadonlyArray<T>,
  arrB: ReadonlyArray<Record<string, unknown>>,
  key: string
): ReadonlyArray<T> => {
  const map = new Map(arrA.map((val) => [val[`${key}`], val]));

  arrB.forEach((val) => {
    const newValue = { ...(map.get(val[`${key}`]) || {}), ...val };
    map.set(val[`${key}`], newValue as T);
  });

  return Array.from(map.values());
};

export const getNestedValue = (
  object: Record<string, any>,
  keyString: string
): any => {
  const keys = keyString.split(/\.(.+)/).filter((n) => n);
  return keys.length <= 1
    ? object[`${keys}`]
    : getNestedValue(object[`${keys[0]}`], keys[1]);
};
