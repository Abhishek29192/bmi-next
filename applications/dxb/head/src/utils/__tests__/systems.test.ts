import { generateSystemPath } from "../systems";

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("generateSystemPath", () => {
  it("should return name and hashed code joined by hyphen", () => {
    const code = "system-code";
    const name = "system-name";
    const hashedCode = "hashed-system-code";

    const systemPath = generateSystemPath({ code, name, hashedCode });

    expect(systemPath).toStrictEqual("s/system-name-hashed-system-code");
  });

  it("should return name with spaces replaced by hyphens", () => {
    const code = "system-code";
    const name = "system name";
    const hashedCode = "hashed-system-code";

    const systemPath = generateSystemPath({ code, name, hashedCode });

    expect(systemPath).toStrictEqual("s/system-name-hashed-system-code");
  });

  it("should return name with underscores replaced by hyphens", () => {
    const code = "system-code";
    const name = "system_name";
    const hashedCode = "hashed-system-code";

    const systemPath = generateSystemPath({ code, name, hashedCode });

    expect(systemPath).toStrictEqual("s/system-name-hashed-system-code");
  });
});
