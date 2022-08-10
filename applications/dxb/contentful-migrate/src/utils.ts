export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));
