export const devLog = (...args) => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};
