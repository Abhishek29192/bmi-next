import logger from "@bmi-digital/functions-logger";
import fetch, { Response } from "node-fetch";
import { IGoogleReCaptchaConsumerProps } from "react-google-recaptcha-v3";
import { useState, useEffect } from "react";
import { TableSize } from "@bmi-digital/components";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { ApprovalStatus } from "@bmi/pim-types";
import { microCopy } from "@bmi/microcopies";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFilenameByRealFileName,
  generateFileNamebyTitle
} from "../components/DocumentFileUtils";
import { GetMicroCopy } from "../components/MicroCopy";
import { Document } from "../types/Document";
import { PseudoZipPIMDocument } from "../types/pim";
import { downloadAs } from "./client-download";
import { formatDate, getCurrentTimeString } from "./dateUtils";
import { useTrackedRef } from "./useTrackedRef";

export const getIsLinkDocument = (document: Document): boolean =>
  "isLinkDocument" in document && document.isLinkDocument;

export const getUniqueId = (document: Document): string =>
  `${document.id}-${document.title}`.replace(/ /g, "_");

export const getFileSizeByDocumentType = (document: Document): number => {
  if (document.__typename === "ContentfulDocument") {
    return document.asset.file.details.size;
  }

  return document.fileSize || 0;
};

export const getFileUrlByDocumentType = (
  document?: Document
): string | undefined => {
  if (!document || document.__typename === "PIMDocumentWithPseudoZip") {
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
    document.approvalStatus === ApprovalStatus.Discontinued
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

    const token = qaAuthToken ? undefined : await executeRecaptcha?.();
    const assetFileCountMap: AssetUniqueFileCountMap = createAssetFileCountMap(
      document.documentList
    );
    const documents = document.documentList.map((asset, index) => ({
      href: asset.url,
      name: asset.realFileName
        ? generateFilenameByRealFileName(assetFileCountMap, asset, index)
        : generateFileNamebyTitle(
            assetFileCountMap,
            asset.title || asset.realFileName || "",
            asset.extension || "",
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

    const data = (await response.json()) as { url: string };

    await downloadAs(data.url, zipFileName);
  } catch (error) {
    logger.error({ message: (error as Error).message });
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
      format: format || "",
      size: size || 0,
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

type UseShowMobileTableHook = () => {
  showMobileTable: boolean;
  handleTableSizeChange: (tableSize: TableSize, requiredWidth: number) => void;
  ref: (newNode: HTMLDivElement) => void;
};

export const useShowMobileTable: UseShowMobileTableHook = () => {
  const theme = useTheme();
  const { ref, node: containerNode } = useTrackedRef<HTMLDivElement>();
  const [desktopTableWidth, setDesktopTableWidth] = useState<
    number | undefined
  >(undefined);
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [showDesktopTable, setShowDesktopTable] = useState<boolean>(!isMobile);

  useEffect(() => {
    if (!desktopTableWidth || !containerNode) {
      return;
    }
    setShowDesktopTable(desktopTableWidth <= containerNode.offsetWidth);

    const handleResize = () => {
      setShowDesktopTable(desktopTableWidth <= containerNode.offsetWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [desktopTableWidth, containerNode]);

  const handleTableSizeChange = (
    newTableSize: TableSize,
    desktopTableWidth?: number
  ) => {
    if (newTableSize !== "normal") {
      setDesktopTableWidth(desktopTableWidth);
    }
  };

  return {
    showMobileTable: isMobile || !showDesktopTable,
    handleTableSizeChange,
    ref
  };
};

export const getCurrentlySelectedDocumentsCount = (
  docs: Document[],
  list: Record<string, any>
): number => {
  const docsCount = docs.reduce(
    (sumCount, curDoc) => (list[getUniqueId(curDoc)] ? sumCount + 1 : sumCount),
    0
  );

  return docsCount;
};
