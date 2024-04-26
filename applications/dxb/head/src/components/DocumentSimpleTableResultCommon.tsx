import CopyToClipboardButton, {
  CopyToClipboardButtonProps
} from "@bmi-digital/components/copy-to-clipboard-button";
import CommonDownloadDocumentButton from "@bmi-digital/components/download-document-button";
import { microCopy } from "@bmi/microcopies";
import classnames from "classnames";
import React, { useMemo } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { getDownloadLink } from "../utils/client-download";
import {
  downloadMultipleFiles,
  getFileUrlByDocumentType,
  mapAssetToFileDownload
} from "../utils/documentUtils";
import getCookie from "../utils/getCookie";
import fileIconsMap from "./FileIconsMap";
import { useSiteContext } from "./Site";
import {
  ExternalLinkIcon,
  StyledIcon,
  Title,
  TitleButton,
  classes
} from "./styles/DocumentSimpleTableResultsCommonStyles";
import type { PseudoZipPIMDocument } from "../types/pim";
import type { Document, TitleField } from "../types/Document";
import type { GTM } from "@bmi-digital/components";

export const MultipleAssetToFileDownload = ({
  document,
  disableRipple,
  title,
  className
}: {
  document: PseudoZipPIMDocument;
  disableRipple?: boolean;
  title: string;
  className?: string;
}): React.ReactElement => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

  return (
    <TitleButton
      disableRipple={disableRipple}
      className={classnames(className, disableRipple && classes.disableRipple)}
      gtm={{
        id: "download1",
        label: "Download",
        action: JSON.stringify(
          Object.values(document.documentList).map((asset) => asset.url)
        )
      }}
      onClick={() =>
        downloadMultipleFiles(document, qaAuthToken, executeRecaptcha)
      }
      variant="text"
      accessibilityLabel="Download"
      startIcon={
        document.format && (
          <StyledIcon name={"FileZIP"} className={"download-icon"} />
        )
      }
      data-testid={`document-table-download-zip-button`}
    >
      <Title>{title}</Title>
    </TitleButton>
  );
};

export const DocumentTitle = (props: {
  document: Document;
  disableRipple?: boolean;
  titleField?: TitleField;
  className?: string;
}) => {
  const { getMicroCopy } = useSiteContext();
  const mappedDocument = mapAssetToFileDownload(props.document, getMicroCopy);
  const title =
    props.titleField === "type"
      ? props.document.assetType.name
      : props.document.title;

  if (mappedDocument.isLinkDocument) {
    return (
      <TitleButton
        variant="text"
        disableRipple={props.disableRipple}
        className={classnames(
          props.className,
          props.disableRipple && classes.disableRipple
        )}
        href={mappedDocument.url}
        external
        startIcon={<ExternalLinkIcon name="External" />}
        data-testid="document-table-external-link-button"
      >
        <Title>{title}</Title>
      </TitleButton>
    );
  }

  if (props.document.__typename === "PIMDocumentWithPseudoZip") {
    return (
      <MultipleAssetToFileDownload
        document={props.document}
        disableRipple={props.disableRipple}
        title={title}
        className={props.className}
      />
    );
  }

  return (
    <TitleButton
      disableRipple={props.disableRipple}
      className={classnames(
        props.className,
        props.disableRipple && classes.disableRipple
      )}
      gtm={{ id: "download1", label: "Download", action: mappedDocument.url }}
      href={getDownloadLink(mappedDocument.url) || ""}
      download
      variant="text"
      startIcon={
        <StyledIcon
          // eslint-disable-next-line security/detect-object-injection
          name={fileIconsMap[mappedDocument.format] || "FileUniversal"}
          className="download-icon"
        />
      }
      data-testid={`document-table-download-${mappedDocument.format}-button`}
    >
      <Title>{title}</Title>
    </TitleButton>
  );
};

type ButtonSizes = "small" | "large";

export const CopyToClipboard = ({
  id,
  title,
  href
}: Pick<CopyToClipboardButtonProps, "id" | "title" | "href">) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <CopyToClipboardButton
      id={id}
      title={title}
      href={href}
      copyAccessibilityLabel={getMicroCopy(
        microCopy.DOCUMENT_LIBRARY_COPY_LINK_ACCESSIBILITY_LABEL
      )}
      copyLinkTooltip={getMicroCopy(
        microCopy.DOCUMENT_LIBRARY_COPY_LINK_TOOLTIP_TITLE
      )}
      linkCopiedTooltip={getMicroCopy(
        microCopy.DOCUMENT_LIBRARY_LINK_COPIED_TOOLTIP_TITLE
      )}
      clipboardErrorMessage={getMicroCopy(microCopy.COPY_LINK_ERROR_MESSAGE)}
      size="extra-small"
    />
  );
};

interface DownloadDocumentButtonProps {
  document: Document;
  size?: ButtonSizes;
}

export const DownloadDocumentButton = ({
  document
}: DownloadDocumentButtonProps) => {
  const { getMicroCopy } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

  const downloadButtonConfig: {
    gtm: GTM;
  } & (
    | {
        href: string;
        onClick?: never;
      }
    | {
        href?: never;
        onClick: () => void;
      }
  ) = useMemo(() => {
    if (document.__typename === "PIMDocumentWithPseudoZip") {
      // For some reason, extracting to its own variable fixes a typing issue
      const config = {
        gtm: {
          id: "download1",
          label: "Download",
          action: JSON.stringify(
            Object.values(document.documentList).map((asset) => asset.url)
          )
        },
        onClick: () =>
          downloadMultipleFiles(document, qaAuthToken, executeRecaptcha)
      };
      return config;
    }

    const documentUrl = getFileUrlByDocumentType(document)!;
    return {
      gtm: {
        id: "download1",
        label: "Download",
        action: documentUrl
      },
      href: getDownloadLink(documentUrl)!
    };
  }, [document, qaAuthToken, executeRecaptcha]);

  return (
    <CommonDownloadDocumentButton
      id={document.id}
      title={document.title}
      {...downloadButtonConfig}
      downloadAccessibilityLabel={getMicroCopy(
        microCopy.DOCUMENT_LIBRARY_DOWNLOAD_ACCESSIBILITY_LABEL
      )}
      downloadTooltip={getMicroCopy(
        microCopy.DOCUMENT_LIBRARY_DOWNLOAD_TOOLTIP_TITLE
      )}
      size="extra-small"
    />
  );
};
