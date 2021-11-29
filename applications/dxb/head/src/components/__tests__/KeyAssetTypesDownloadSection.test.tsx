import React from "react";
import axios from "axios";
import MockDate from "mockdate";
import { render } from "@testing-library/react";
import KeyAssetTypesDownloadSection, {
  mapAssetToCommonData,
  handleDownloadClick
} from "../KeyAssetTypesDownloadSection";
import * as ClientDownloadUtils from "../../utils/client-download";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import createPimDocument from "../../__tests__/PimDocumentHelper";
import createPimLinkDocument from "../../__tests__/PimLinkDocumentHelper";
import createAssetType from "../../__tests__/AssetTypeHelper";

jest.mock("axios");

// Needed to mock only one method of module
jest.spyOn(ClientDownloadUtils, "downloadAs").mockImplementation();

jest.spyOn(Date.prototype, "getDate").mockReturnValue(0);

const TEST_DATE = new Date(0);

MockDate.set(TEST_DATE);

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("KeyAssetTypesDownloadSection component", () => {
  it("renders correctly", () => {
    const document1 = createContentfulDocument({
      assetType: createAssetType({
        pimCode: "SAT",
        name: "Some Asset Type"
      }),
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test.pdf",
          contentType: "application/pdf",
          details: {
            size: 89898
          }
        }
      }
    });

    const document2 = createContentfulDocument({
      assetType: createAssetType({
        pimCode: "SAT",
        name: "Some Asset Type"
      }),
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test1.pdf",
          contentType: "application/pdf",
          details: {
            size: 89897
          }
        }
      }
    });

    const document3 = createContentfulDocument({
      assetType: createAssetType({
        pimCode: "AAT",
        name: "Another Asset Type"
      }),
      asset: {
        file: {
          url: "http://doesnot-exist.com/fileName",
          fileName: "test2.pdf",
          contentType: "application/pdf",
          details: {
            size: 89896
          }
        }
      }
    });

    const assetTypes = ["SAT", "AAT"];

    const { container } = render(
      <KeyAssetTypesDownloadSection
        documents={[document1, document2, document3]}
        assetTypes={assetTypes}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  describe("handleDownloadClick function", () => {
    const document1 = createContentfulDocument();

    const document2 = createContentfulDocument();

    const list = [
      mapAssetToCommonData(document1),
      mapAssetToCommonData(document2)
    ];

    const token = "token";
    const ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    afterAll(() => {
      process.env = ENV;
    });

    it("should download files", async () => {
      process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT =
        "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT";

      mockedAxios.post.mockResolvedValueOnce({ data: { url: "url" } });

      await handleDownloadClick(list, token);

      expect(mockedAxios.post).toHaveBeenLastCalledWith(
        "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
        {
          documents: [
            {
              href: "http://doesnot-exist.com/fileName",
              name: "fileName"
            },
            {
              href: "http://doesnot-exist.com/fileName",
              name: "fileName"
            }
          ]
        },
        { headers: { "X-Recaptcha-Token": "token" }, responseType: "text" }
      );
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledWith(
        "url",
        "BMI_19700101000000.zip"
      );
    });

    it("should not download empty list", async () => {
      await handleDownloadClick([], token);
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
    });

    it("should prevent download on GATSBY_PREVIEW", async () => {
      process.env.GATSBY_PREVIEW = "GATSBY_PREVIEW";

      jest.spyOn(window, "alert").mockImplementation();

      await handleDownloadClick(list, token);

      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
      expect(window.alert).toHaveBeenCalledWith(
        "You cannot download documents on the preview enviornment."
      );
    });
  });

  describe("mapAssetToCommonData function", () => {
    it("if Pim Document", () => {
      const pimDocument = createPimDocument();
      const expectedObj = {
        href: "http://localhost/pim-document-id",
        name: "pim-document-id.pdf",
        assetType: "asset-name"
      };

      const data = mapAssetToCommonData(pimDocument);

      expect(data).toMatchObject(expectedObj);
    });

    it("if Pim Link Document", () => {
      const pimLinkDocument = createPimLinkDocument();
      const expectedObj = {
        href: "http://localhost/pim-link-document-id",
        name: "pim-link-document-title",
        assetType: "asset-name"
      };

      const data = mapAssetToCommonData(pimLinkDocument);

      expect(data).toMatchObject(expectedObj);
    });

    it("if Contentful Document", () => {
      const contentfulDocument = createContentfulDocument();
      const expectedObj = {
        href: "http://doesnot-exist.com/fileName",
        name: "fileName",
        assetType: "asset-name"
      };

      const data = mapAssetToCommonData(contentfulDocument);

      expect(data).toMatchObject(expectedObj);
    });
  });
});
