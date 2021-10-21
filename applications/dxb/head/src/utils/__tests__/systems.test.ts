import { generateSystemPath } from "../systems";

const generateIdFromString = jest.fn();
jest.mock("../encryption", () => ({
  generateIdFromString: (str: string, useDate: boolean) =>
    generateIdFromString(str, useDate)
}));

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("generateSystemPath", () => {
  it("should return name and hashed code joined by hyphen", () => {
    const code = "system-code";
    const name = "system-name";
    generateIdFromString.mockReturnValue("hashed-system-code");

    const systemPath = generateSystemPath({ code, name });

    expect(systemPath).toStrictEqual("s/system-name-hashed-system-code");
  });

  it("should return name with spaces replaced by hyphens", () => {
    const code = "system-code";
    const name = "system name";
    generateIdFromString.mockReturnValue("hashed-system-code");

    const systemPath = generateSystemPath({ code, name });

    expect(systemPath).toStrictEqual("s/system-name-hashed-system-code");
  });

  it("should return name with underscores replaced by hyphens", () => {
    const code = "system-code";
    const name = "system_name";
    generateIdFromString.mockReturnValue("hashed-system-code");

    const systemPath = generateSystemPath({ code, name });

    expect(systemPath).toStrictEqual("s/system-name-hashed-system-code");
  });
});
