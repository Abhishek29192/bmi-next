export const isDefined = <T>(argument?: T): argument is T => {
  return argument !== undefined && argument !== null;
};
