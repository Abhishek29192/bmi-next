import axios from "axios";
import { handleDownloadClick } from "../DocumentResultsFooter";
import { Data as DocumentData } from "../Document";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import * as ClientDownload from "../../utils/client-download";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("_", () => {
  const resetList = jest.fn();
  const list: Record<string, DocumentData> = {
    name1: createContentfulDocument(),
    name2: createContentfulDocument()
  };
  const token = "token";
  const ENV = process.env;
  const TEST_DATE = Date.now();

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    process.env = { ...ENV };
  });

  afterAll(() => {
    process.env = ENV;
  });

  it("should download files", async () => {
    process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT =
      "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT";

    mockedAxios.post.mockResolvedValueOnce({ data: { url: "url" } });
    jest.spyOn(ClientDownload, "downloadAs").mockImplementation();
    jest.spyOn(Date.prototype, "setDate").mockReturnValue(TEST_DATE);

    await handleDownloadClick(list, token, resetList);

    expect(mockedAxios.post).toHaveBeenLastCalledWith(
      "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
      {
        documents: [
          {
            href: "https:http://doesnot-exist.com/fileName",
            name: "contentful-document-title.fileName"
          },
          {
            href: "https:http://doesnot-exist.com/fileName",
            name: "contentful-document-title.fileName"
          }
        ]
      },
      { headers: { "X-Recaptcha-Token": "token" }, responseType: "text" }
    );
    expect(ClientDownload.downloadAs).toHaveBeenCalledWith(
      "url",
      `BMI_${
        new Date(TEST_DATE).toJSON().replace(/-|:|T/g, "").split(".")[0]
      }.zip`
    );
    expect(resetList).toHaveBeenCalledTimes(1);
  });

  it("should do not download empty list", async () => {
    await handleDownloadClick({}, token, resetList);
    expect(ClientDownload.downloadAs).toHaveBeenCalledTimes(0);
  });

  it("should prevent download on GATSBY_PREVIEW", async () => {
    process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";

    jest.spyOn(window, "alert").mockImplementation();

    await handleDownloadClick(list, token, resetList);

    expect(ClientDownload.downloadAs).toHaveBeenCalledTimes(0);
    expect(window.alert).toHaveBeenCalledWith(
      "You cannot download documents on the preview enviornment."
    );
    expect(resetList).toHaveBeenCalledTimes(1);
  });
});
