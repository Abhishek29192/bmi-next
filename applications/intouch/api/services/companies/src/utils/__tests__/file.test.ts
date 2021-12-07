import { filesTypeValidate } from "../file";

const fromStreamMock = jest.fn();
jest.mock("file-type", () => {
  return {
    fromStream: () => fromStreamMock()
  };
});

describe("filesTypeValidate", () => {
  it("should return true if files don't exist", async () => {
    expect(await filesTypeValidate(null)).toBeTruthy();
    expect(await filesTypeValidate(undefined)).toBeTruthy();
    expect(await filesTypeValidate([])).toBeTruthy();
    expect(await filesTypeValidate([])).toBeTruthy();
  });
  it("should return true if files have valid mimetype", async () => {
    fromStreamMock
      .mockReturnValueOnce({
        mime: "application/pdf"
      })
      .mockReturnValueOnce({
        mime: "image/jpg"
      })
      .mockReturnValueOnce({
        mime: "image/jpeg"
      })
      .mockReturnValueOnce({
        mime: "image/png"
      });
    expect(
      await filesTypeValidate([
        {
          filename: "mock-file.pdf",
          mimetype: "application/pdf",
          encoding: "",
          createReadStream: () => {}
        },
        {
          filename: "mock-file.jpg",
          mimetype: "image/jpg",
          encoding: "",
          createReadStream: () => {}
        },
        {
          filename: "mock-file.jpeg",
          mimetype: "image/jpeg",
          encoding: "",
          createReadStream: () => {}
        },
        {
          filename: "mock-file.png",
          mimetype: "image/png",
          encoding: "",
          createReadStream: () => {}
        }
      ])
    ).toBeTruthy();
  });
  it("should throw exception if file has not valid mimetype", async () => {
    fromStreamMock.mockReturnValueOnce({
      mime: "application/vnd.microsoft.portable-executable"
    });

    await expect(
      filesTypeValidate([
        {
          filename: "mock-file.exe",
          mimetype: "application/vnd.microsoft.portable-executable",
          encoding: "",
          createReadStream: () => {}
        }
      ])
    ).rejects.toThrow("mock-file.exe not allowed");
  });
});
