import {
  Button,
  ButtonProps,
  ClickableAction,
  DownloadList,
  DownloadListContext,
  replaceSpaces,
  Table
} from "@bmi-digital/components";
import logger from "@bmi-digital/functions-logger";
import {
  ContentfulDocument as EsContentfulDocument,
  PimProductDocument as EsPimDocument,
  PimSystemDocument as EsPimSystemDocument
} from "@bmi/elasticsearch-types";
import { GetApp } from "@mui/icons-material";
import classnames from "classnames";
import filesize from "filesize";
import fetch, { Response } from "node-fetch";
import React, { useContext } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { ContentfulDocument } from "../types/Document";
import {
  ProductDocument as FsPimDocument,
  PseudoZipPIMDocument,
  SystemDocument as FsPimSystemDocument
} from "../types/pim";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import getCookie from "../utils/getCookie";
import withGTM from "../utils/google-tag-manager";
import { useIsMobileDevice } from "../utils/useIsMobileDevice";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFilenameByRealFileName,
  generateFileNamebyTitle
} from "./DocumentFileUtils";
import { DocumentSimpleTableResultsMobile } from "./DocumentSimpleTableResultsMobile";
import fileIconsMap from "./FileIconsMap";
import { GetMicroCopy } from "./MicroCopy";
import { useSiteContext } from "./Site";
import {
  classes,
  DocumentRow,
  DocumentStatus,
  DownloadIcon,
  ExternalLinkIcon,
  NoDocumentIcon,
  StyledSimpleTableResults,
  StyledTableCell,
  StyledTitleTableCell,
  Title
} from "./styles/DocumentSimpleTableResultsStyles";

export type AvailableHeader =
  | "typeCode"
  | "type"
  | "name"
  | "title"
  | "download"
  | "add"
  | "productStatus"
  | "validityDate";

export type Document =
  | ContentfulDocument
  | FsPimDocument
  | FsPimSystemDocument
  | PseudoZipPIMDocument
  | EsContentfulDocument
  | EsPimDocument
  | EsPimSystemDocument;

export type Props = {
  documents: readonly Document[];
  headers?: AvailableHeader[];
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

const isLinkDocument = (document: Document): boolean =>
  "isLinkDocument" in document && document.isLinkDocument;

const getUniqueId = (document: Document): string =>
  replaceSpaces(`${document.id}-${document.title}`);

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

export const formatDate = (document: Document): string => {
  if (!("validUntil" in document) || !document.validUntil) {
    return "-";
  }

  const dateObj = new Date(document.validUntil);
  const day =
    dateObj.getDate().toString().length === 1
      ? `0${dateObj.getDate()}`
      : dateObj.getDate();

  let month = `${dateObj.getMonth() + 1}`;
  month = month.length === 1 ? `0${month}` : month;

  return `${day}.${month}.${dateObj.getFullYear()}`;
};

const DocumentCells = ({
  document,
  headers
}: {
  document: Document;
  headers: AvailableHeader[];
}) => {
  const { getMicroCopy } = useSiteContext();
  const { __typename } = document;
  return (
    <>
      {headers.map((header) => {
        const key = `${__typename}-body-${header}`;

        if (header === "typeCode") {
          return (
            <StyledTableCell
              key={key}
              data-testid={`document-table-title-${document.id}`}
            >
              <abbr title={document.assetType.name}>
                {document.assetType.code}
              </abbr>
            </StyledTableCell>
          );
        }

        if (header === "type") {
          return (
            <StyledTableCell
              key={key}
              data-testid={`document-table-type-${document.id}`}
            >
              {document.assetType.name}
            </StyledTableCell>
          );
        }

        if (header === "productStatus") {
          return (
            <StyledTableCell key={key}>
              {"approvalStatus" in document ? (
                <DocumentStatus status={document.approvalStatus}>
                  {getProductStatus(document, getMicroCopy)}
                </DocumentStatus>
              ) : (
                "-"
              )}
            </StyledTableCell>
          );
        }

        if (header === "validityDate") {
          return (
            <StyledTableCell key={key}>{formatDate(document)}</StyledTableCell>
          );
        }

        if (header === "name") {
          if (
            document.__typename === "PIMDocument" ||
            document.__typename === "PIMSystemDocument"
          ) {
            return (
              <StyledTableCell
                key={key}
                data-testid={`document-table-name-${document.id}`}
              >
                {document.title}
              </StyledTableCell>
            );
          }
        }

        if (header === "title") {
          return (
            <StyledTitleTableCell
              key={key}
              data-testid={`document-table-title-${document.id}`}
            >
              <Title>{document.title}</Title>
            </StyledTitleTableCell>
          );
        }

        if (header === "download") {
          return (
            <StyledTableCell
              align="left"
              key={key}
              data-testid={`document-table-download-${document.id}`}
            >
              {!isLinkDocument(document) ? (
                document.__typename === "PIMDocumentWithPseudoZip" ? (
                  <MultipleAssetToFileDownload document={document} />
                ) : (
                  <FileDownloadButton
                    {...mapAssetToFileDownload(document, getMicroCopy)}
                  />
                )
              ) : (
                <Button
                  isIconButton
                  variant="text"
                  action={{
                    model: "htmlLink",
                    href: (document as FsPimDocument).url,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  }}
                  data-testid="document-table-external-link-button"
                >
                  <ExternalLinkIcon name={"External"} />
                </Button>
              )}
            </StyledTableCell>
          );
        }

        if (header === "add") {
          return !(document.__typename === "PIMDocumentWithPseudoZip") ? (
            <StyledTableCell
              align="center"
              key={key}
              data-testid={`document-table-add-${document.id}`}
            >
              {!isLinkDocument(document) ? (
                <DownloadList.Checkbox
                  name={getUniqueId(document)}
                  maxLimitReachedLabel={getMicroCopy(
                    microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
                  )}
                  ariaLabel={`${getMicroCopy(
                    microCopy.DOCUMENT_LIBRARY_DOWNLOAD
                  )} ${document.title}`}
                  value={document}
                  fileSize={
                    document[typenameToSizeMap[document.__typename]] || 0
                  }
                />
              ) : (
                <NoDocumentIcon>-</NoDocumentIcon>
              )}
            </StyledTableCell>
          ) : (
            <StyledTableCell
              align="center"
              key={key}
              data-testid={`document-table-add-${document.id}`}
            >
              <DownloadList.Checkbox
                name={getUniqueId(document)}
                maxLimitReachedLabel={getMicroCopy(
                  microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
                )}
                ariaLabel={`${getMicroCopy(
                  microCopy.DOCUMENT_LIBRARY_DOWNLOAD
                )} ${document.assetType.name}`}
                value={document.documentList}
                fileSize={document.fileSize}
              />
            </StyledTableCell>
          );
        }

        return (
          <StyledTableCell
            key={key}
            data-testid={`document-table-unknown-${document.id}`}
          >
            n/d
          </StyledTableCell>
        );
      })}
    </>
  );
};

export const mapAssetToFileDownload = (
  data:
    | ContentfulDocument
    | FsPimDocument
    | FsPimSystemDocument
    | EsContentfulDocument
    | EsPimDocument
    | EsPimSystemDocument,
  getMicroCopy: GetMicroCopy
): FileDownloadButtonProps => {
  if (
    data.__typename === "PIMDocument" ||
    data.__typename === "PIMSystemDocument"
  ) {
    const { url, format, fileSize: size } = data;

    return {
      url,
      format,
      size,
      assetTypeName: data.assetType.name,
      title: data.title,
      isLinkDocument: data.isLinkDocument,
      productStatus: getProductStatus(data, getMicroCopy),
      validUntil: formatDate(data)
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

export const MultipleAssetToFileDownload = ({
  document,
  isMobile = false
}: {
  document: PseudoZipPIMDocument;
  isMobile?: boolean;
}): React.ReactElement => {
  const {
    config: { documentDownloadEndpoint }
  } = useConfig();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const downloadMultipleFiles = async () => {
    try {
      if (!documentDownloadEndpoint) {
        throw Error(
          "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
        );
      }
      const [currentTime] = new Date()
        .toJSON()
        .replace(/[-:T]/g, "")
        .split(".");
      let zipFileName = `BMI_${document.assetType.pimCode + currentTime}.zip`;
      if (document.documentList.length > 0) {
        zipFileName = `${
          "productName" in document && `${document.productName} `
        }${document.assetType.name}.zip`;
      }

      const token = qaAuthToken ? undefined : await executeRecaptcha();
      const assetFileCountMap: AssetUniqueFileCountMap =
        createAssetFileCountMap(document.documentList);
      const documents = document.documentList.map((asset, index) => ({
        href: asset.url,
        name:
          asset.realFileName && asset.realFileName !== ""
            ? generateFilenameByRealFileName(assetFileCountMap, asset, index)
            : generateFileNamebyTitle(
                assetFileCountMap,
                asset.title || asset.realFileName,
                asset.extension,
                index
              )
      }));

      let headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-Recaptcha-Token": token
      };
      if (qaAuthToken) {
        headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
      }
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
  if (isMobile) {
    return (
      <GTMButton
        gtm={{
          id: "download1",
          label: "Download",
          action: JSON.stringify(
            Object.values(document.documentList).map((asset) => asset.url)
          )
        }}
        variant="text"
        endIcon={<GetApp />}
        action={{
          model: "default",
          onClick: downloadMultipleFiles
        }}
        data-testid={`document-table-download-zip-button`}
      >
        {filesize(document.fileSize)}
      </GTMButton>
    );
  }

  return (
    <GTMButton
      gtm={{
        id: "download1",
        label: "Download",
        action: JSON.stringify(
          Object.values(document.documentList).map((asset) => asset.url)
        )
      }}
      action={{
        model: "default"
      }}
      onClick={downloadMultipleFiles}
      variant="text"
      accessibilityLabel="Download"
      startIcon={
        document.format && (
          <DownloadIcon name={"FileZIP"} className={"download-icon"} />
        )
      }
      data-testid={`document-table-download-zip-button`}
    >
      {filesize(document.fileSize)}
    </GTMButton>
  );
};

export type FileDownloadButtonProps = {
  url: string;
  format: string;
  size: number;
  assetTypeName: string;
  title: string;
  isLinkDocument: boolean;
  productStatus: string;
  validUntil: string;
};

const FileDownloadButton = ({ url, format, size }: FileDownloadButtonProps) => {
  return format && url ? (
    <GTMButton
      gtm={{ id: "download1", label: "Download", action: url }}
      action={{
        model: "download",
        href: getDownloadLink(url)
      }}
      variant="text"
      startIcon={
        // eslint-disable-next-line security/detect-object-injection
        format && (
          <DownloadIcon
            // eslint-disable-next-line security/detect-object-injection
            name={fileIconsMap[format] || "FileUniversal"}
            className={"download-icon"}
          />
        )
      }
      data-testid={`document-table-download-${format}-button`}
    >
      {filesize(size)}
    </GTMButton>
  ) : null;
};

const typenameToSizeMap: Record<
  (
    | ContentfulDocument
    | FsPimDocument
    | FsPimSystemDocument
    | EsContentfulDocument
    | EsPimDocument
    | EsPimSystemDocument
  )["__typename"],
  string | number
> = {
  ContentfulDocument: "asset.file.details.size",
  PIMDocument: "fileSize",
  PIMSystemDocument: "fileSize"
};

const DocumentSimpleTableResults = ({
  documents,
  headers = ["typeCode", "title", "download", "add"]
}: Props): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();
  const isMobile = useIsMobileDevice();
  const { list } = useContext(DownloadListContext);

  if (isMobile) {
    return <DocumentSimpleTableResultsMobile documents={documents} />;
  }

  return (
    <StyledSimpleTableResults
      className={classnames("DocumentSimpleTableResults")}
      data-testid="document-simple-table-results"
    >
      <Table rowBgColorPattern="none">
        <Table.Head>
          <Table.Row>
            {headers.map((header) => (
              <Table.Cell
                key={`header-${header}`}
                className={classnames(
                  ["download", "add"].includes(header) && classes.tableHeader
                )}
              >
                {getMicroCopy(`documentLibrary.headers.${header}`)}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {documents.map((document, index) => {
            if (!document) {
              return;
            }
            const { __typename } = document;

            return (
              <DocumentRow
                key={`${__typename}-${index}`}
                className={classnames(
                  "row",
                  // eslint-disable-next-line security/detect-object-injection
                  !!list[getUniqueId(document)] && classes.checked
                )}
                // eslint-disable-next-line security/detect-object-injection
                selected={!!list[getUniqueId(document)]}
                data-testid={`document-table-row-${document.id}`}
              >
                <DocumentCells document={document} headers={headers} />
              </DocumentRow>
            );
          })}
        </Table.Body>
      </Table>
    </StyledSimpleTableResults>
  );
};

export default DocumentSimpleTableResults;
