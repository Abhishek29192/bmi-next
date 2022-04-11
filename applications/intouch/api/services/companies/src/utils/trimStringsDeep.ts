import cloneDeepWith from "lodash.clonedeepwith";

// Trims all strings in the object
const trimStringsDeep = <T>(object: T): T => {
  return cloneDeepWith(object, (value) => {
    if (typeof value === "string") {
      return value.trim();
    }
  });
};

export default trimStringsDeep;
