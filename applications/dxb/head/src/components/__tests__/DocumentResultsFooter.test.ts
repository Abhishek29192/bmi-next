import axios from "axios";
import { handleDownloadClick } from "../DocumentResultsFooter";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import { downloadAs } from "../../utils/client-download";

jest.mock("axios");
jest.mock("../../utils/client-download");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("DocumentResultsFooter component", () => {
  const resetList = jest.fn();
  const list = {
    name1: createContentfulDocument(),
    name2: createContentfulDocument()
  };
  const token = "token";
  const ENV = process.env;

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

    await handleDownloadClick(list, token, resetList);

    expect(mockedAxios.post).toHaveBeenLastCalledWith(
      "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
      {
        documents: [
          {
            href: "https://doesnot-exist.com/fileName",
            name: "contentful-document-title.fileName"
          },
          {
            href: "https://doesnot-exist.com/fileName",
            name: "contentful-document-title.fileName"
          }
        ]
      },
      { headers: { "X-Recaptcha-Token": "token" }, responseType: "text" }
    );
    expect(resetList).toHaveBeenCalledTimes(1);
  });

  it("should not download empty list", async () => {
    await handleDownloadClick({}, token, resetList);
    expect(downloadAs).toHaveBeenCalledTimes(0);
  });

  it("should prevent download on GATSBY_PREVIEW", async () => {
    process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";

    jest.spyOn(window, "alert").mockImplementation();

    await handleDownloadClick(list, token, resetList);

    expect(downloadAs).toHaveBeenCalledTimes(0);
    expect(window.alert).toHaveBeenCalledWith(
      "You cannot download documents on the preview enviornment."
    );
    expect(resetList).toHaveBeenCalledTimes(1);
  });
});
