export const fetchSpy = jest.fn();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    __esModule: true,
    ...original,
    default: (...options: any[]) => fetchSpy(options)
  };
});

export const loggerInfo = jest.fn();
export const loggerError = jest.fn();
jest.mock("@bmi-digital/functions-logger", () => ({
  info: (message: any) => loggerInfo(message),
  error: (message: any) => loggerError(message)
}));
