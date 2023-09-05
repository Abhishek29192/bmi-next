export const isDefined = <T>(
  argument?: T
): argument is Exclude<T, null | undefined> => {
  return argument !== undefined && argument !== null;
};
