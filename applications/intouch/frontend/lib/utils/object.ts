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
