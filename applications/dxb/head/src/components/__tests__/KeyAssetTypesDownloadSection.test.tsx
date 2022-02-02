import React from "react";
import axios from "axios";
import MockDate from "mockdate";
import { render } from "@testing-library/react";
import KeyAssetTypesDownloadSection, {
  handleDownloadClick,
  mapAssetToCommonData
} from "../KeyAssetTypesDownloadSection";
import * as ClientDownloadUtils from "../../utils/client-download";
import createContentfulDocument from "../../__tests__/ContentfulDocumentHelper";
import createPimDocument from "../../__tests__/PimDocumentHelper";
import createPimLinkDocument from "../../__tests__/PimLinkDocumentHelper";
import createAssetType from "../../__tests__/AssetTypeHelper";
import { FileContentTypeEnum } from "../types/pim";

jest.mock("axios");

// Needed to mock only one method of module
jest.spyOn(ClientDownloadUtils, "downloadAs").mockImplementation();

jest.spyOn(Date.prototype, "getDate").mockReturnValue(0);

const TEST_DATE = new Date(0);

MockDate.set(TEST_DATE);

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("KeyAssetTypesDownloadSection component", () => {
  const asset = {
    asset: {
      file: {
        url: "http://doesnot-exist.com/fileName",
        fileName: `fileName.pdf`,
        contentType: "" as FileContentTypeEnum,
        details: {
          size: 89898
        }
      }
    }
  };

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
          contentType: FileContentTypeEnum.APPLICATION_PDF,
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
          contentType: FileContentTypeEnum.APPLICATION_PDF,
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
          contentType: FileContentTypeEnum.APPLICATION_PDF,
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

    expect(container).toMatchSnapshot();
  });

  describe("handleDownloadClick function", () => {
    const document1 = createContentfulDocument(asset);

    const document2 = createContentfulDocument(asset);

    const list = [
      mapAssetToCommonData(document1),
      mapAssetToCommonData(document2)
    ];

    const mockConfig = (
      isPreviewMode = false,
      documentDownloadEndpoint = "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT"
    ) => ({
      isPreviewMode,
      documentDownloadEndpoint
    });

    const token = "token";

    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    it("should download files", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { url: "url" } });

      await handleDownloadClick(list, token, mockConfig());

      expect(mockedAxios.post).toHaveBeenLastCalledWith(
        "GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT",
        {
          documents: [
            {
              href: "http://doesnot-exist.com/fileName",
              name: "contentful-document-title.pdf"
            },
            {
              href: "http://doesnot-exist.com/fileName",
              name: "contentful-document-title.pdf"
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
      await handleDownloadClick([], token, mockConfig());
      expect(ClientDownloadUtils.downloadAs).toHaveBeenCalledTimes(0);
    });

    it("should prevent download on GATSBY_PREVIEW", async () => {
      jest.spyOn(window, "alert").mockImplementation();

      await handleDownloadClick(list, token, mockConfig(true));

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
        name: "pim-document-title.pdf",
        assetType: "asset-name"
      };

      const data = mapAssetToCommonData(pimDocument);

      expect(data).toMatchObject(expectedObj);
    });

    it("if Pim Link Document", () => {
      const pimLinkDocument = createPimLinkDocument({
        url: "http://localhost/pim-link-document-id.pdf"
      });
      const expectedObj = {
        href: "http://localhost/pim-link-document-id.pdf",
        name: "pim-link-document-title.pdf",
        assetType: "asset-name"
      };

      const data = mapAssetToCommonData(pimLinkDocument);

      expect(data).toMatchObject(expectedObj);
    });

    it("if Contentful Document", () => {
      const contentfulDocument = createContentfulDocument(asset);
      const expectedObj = {
        href: "http://doesnot-exist.com/fileName",
        name: "contentful-document-title.pdf",
        assetType: "asset-name"
      };

      const data = mapAssetToCommonData(contentfulDocument);

      expect(data).toMatchObject(expectedObj);
    });
  });
});
