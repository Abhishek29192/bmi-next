import logger from "@bmi-digital/functions-logger";
import fetch, { Response } from "node-fetch";
import { IGoogleReCaptchaConsumerProps } from "react-google-recaptcha-v3";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFilenameByRealFileName,
  generateFileNamebyTitle
} from "../components/DocumentFileUtils";
import { GetMicroCopy } from "../components/MicroCopy";
import { microCopy } from "../constants/microCopies";
import { Document } from "../types/Document";
import { PseudoZipPIMDocument } from "../types/pim";
import { downloadAs } from "./client-download";
import { formatDate, getCurrentTimeString } from "./dateUtils";

export const getIsLinkDocument = (document: Document): boolean =>
  "isLinkDocument" in document && document.isLinkDocument;

export const getFileSizeByDocumentType = (document: Document): number => {
  if (document.__typename === "ContentfulDocument") {
    return document.asset.file.details.size;
  }

  return document.fileSize;
};

export const getFileUrlByDocumentType = (
  document: Document
): string | undefined => {
  if (document.__typename === "PIMDocumentWithPseudoZip") {
    return;
  }

  if (document.__typename === "ContentfulDocument") {
    return document.asset.file.url;
  }

  return document.url;
};

export const getProductStatus = (
  document: Document,
  getMicroCopy: GetMicroCopy
): string => {
  if (!("approvalStatus" in document)) {
    return "-";
  }

  return getMicroCopy(
    document.approvalStatus === "discontinued"
      ? microCopy.DOCUMENT_STATUS_DISCONTINUED
      : microCopy.DOCUMENT_STATUS_AVAILABLE
  );
};

export const getValidityDate = (document: Document): string => {
  if (!("validUntil" in document) || !document.validUntil) {
    return "-";
  }

  return formatDate(document.validUntil);
};

export const downloadMultipleFiles = async (
  document: PseudoZipPIMDocument,
  qaAuthToken: string,
  executeRecaptcha: IGoogleReCaptchaConsumerProps["executeRecaptcha"]
): Promise<void> => {
  try {
    const documentDownloadEndpoint =
      process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT;

    if (!documentDownloadEndpoint) {
      throw new Error(
        "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
    }
    const currentTime = getCurrentTimeString();
    const zipFileName =
      document.documentList.length > 0
        ? `${"productName" in document && `${document.productName} `}${
            document.assetType.name
          }.zip`
        : `BMI_${document.assetType.pimCode + currentTime}.zip`;

    const token = qaAuthToken ? undefined : await executeRecaptcha();
    const assetFileCountMap: AssetUniqueFileCountMap = createAssetFileCountMap(
      document.documentList
    );
    const documents = document.documentList.map((asset, index) => ({
      href: asset.url,
      name: asset.realFileName
        ? generateFilenameByRealFileName(assetFileCountMap, asset, index)
        : generateFileNamebyTitle(
            assetFileCountMap,
            asset.title || asset.realFileName,
            asset.extension,
            index
          )
    }));

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Recaptcha-Token": token,
      ...(qaAuthToken ? { authorization: `Bearer ${qaAuthToken}` } : {})
    };

    const response: Response = await fetch(documentDownloadEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ documents })
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    await downloadAs(data.url, zipFileName);
  } catch (error) {
    logger.error({ message: error.message });
  }
};

export type FileDownloadButtonProps = {
  url: string | undefined;
  format: string;
  size: number;
  assetTypeName: string;
  title: string;
  isLinkDocument: boolean;
  productStatus: string;
  validUntil: string;
};

export const mapAssetToFileDownload = (
  data: Document,
  getMicroCopy: GetMicroCopy
): FileDownloadButtonProps => {
  if (
    data.__typename === "PIMDocument" ||
    data.__typename === "PIMSystemDocument" ||
    data.__typename === "PIMDocumentWithPseudoZip"
  ) {
    const { format, fileSize: size } = data;

    return {
      url: "url" in data ? data.url : undefined,
      format,
      size,
      assetTypeName: data.assetType.name,
      title: data.title,
      isLinkDocument: data.isLinkDocument,
      productStatus: getProductStatus(data, getMicroCopy),
      validUntil: getValidityDate(data)
    };
  }

  const {
    asset: { file }
  } = data;

  return {
    url: file.url,
    format: file.contentType,
    size: file.details.size,
    assetTypeName: data.assetType.name,
    title: data.title,
    isLinkDocument: false,
    productStatus: "-",
    validUntil: "-"
  };
};
