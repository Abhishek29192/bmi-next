export const devLog = (...args: unknown[]) => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};
