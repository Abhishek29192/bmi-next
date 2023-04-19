import React, { useMemo, useState } from "react";
import {
  ButtonProps,
  ClickableAction,
  IconButtonProps,
  Tooltip
} from "@bmi-digital/components";
import { Box, useMediaQuery } from "@mui/material";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import filesize from "filesize";
import { GetApp } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Document } from "../types/Document";
import { microCopy } from "../constants/microCopies";
import { getDownloadLink } from "../utils/client-download";
import getCookie from "../utils/getCookie";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import withGTM, { GTM } from "../utils/google-tag-manager";
import {
  downloadMultipleFiles,
  getFileUrlByDocumentType,
  mapAssetToFileDownload
} from "../utils/documentUtils";
import { PseudoZipPIMDocument } from "../types/pim";
import { useSiteContext } from "./Site";
import {
  ActionIcon,
  ExternalLinkIcon,
  StyledButton,
  StyledDocumentIcon,
  Title,
  TitleButton
} from "./styles/DocumentSimpleTableResultsCommonStyles";
import fileIconsMap from "./FileIconsMap";

const GTMButton = withGTM<
  (ButtonProps | IconButtonProps) & {
    action?: ClickableAction;
  }
>(StyledButton);

const GTMDocumentTitleButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(TitleButton);

export const MultipleAssetToFileDownload = ({
  document
}: {
  document: PseudoZipPIMDocument;
}): React.ReactElement => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

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
          onClick: () =>
            downloadMultipleFiles(document, qaAuthToken, executeRecaptcha)
        }}
        data-testid={`document-table-download-zip-button`}
      >
        {filesize(document.fileSize)}
      </GTMButton>
    );
  }

  return (
    <GTMDocumentTitleButton
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
      onClick={() =>
        downloadMultipleFiles(document, qaAuthToken, executeRecaptcha)
      }
      variant="text"
      accessibilityLabel="Download"
      startIcon={
        document.format && (
          <StyledDocumentIcon name={"FileZIP"} className={"download-icon"} />
        )
      }
      data-testid={`document-table-download-zip-button`}
    >
      <Title>{document.title}</Title>
    </GTMDocumentTitleButton>
  );
};

export const DocumentTitle = (props: { document: Document }) => {
  const { getMicroCopy } = useSiteContext();
  const mappedDocument = mapAssetToFileDownload(props.document, getMicroCopy);

  if (mappedDocument.isLinkDocument) {
    return (
      <TitleButton
        variant="text"
        action={{
          model: "htmlLink",
          href: mappedDocument.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }}
        startIcon={<ExternalLinkIcon name="External" />}
        data-testid="document-table-external-link-button"
      >
        <Title>{mappedDocument.title}</Title>
      </TitleButton>
    );
  }

  if (props.document.__typename === "PIMDocumentWithPseudoZip") {
    return <MultipleAssetToFileDownload document={props.document} />;
  }

  return (
    <GTMDocumentTitleButton
      gtm={{ id: "download1", label: "Download", action: mappedDocument.url }}
      action={{
        model: "download",
        href: getDownloadLink(mappedDocument.url)
      }}
      variant="text"
      startIcon={
        <StyledDocumentIcon
          // eslint-disable-next-line security/detect-object-injection
          name={fileIconsMap[mappedDocument.format] || "FileUniversal"}
          className="download-icon"
        />
      }
      data-testid={`document-table-download-${mappedDocument.format}-button`}
    >
      <Title>{mappedDocument.title}</Title>
    </GTMDocumentTitleButton>
  );
};

export const CopyToClipboard = (props: {
  id: string;
  url: string;
  title: string;
}) => {
  const { getMicroCopy } = useSiteContext();
  const [isActive, setIsActive] = useState<boolean>(false);

  const saveToClipboard = async (): Promise<void> => {
    const downloadLink = getDownloadLink(props.url);
    await navigator.clipboard.writeText(downloadLink);
    setIsActive(true);
  };

  return (
    <Tooltip
      PopperProps={{ disablePortal: true }}
      TransitionProps={{ exit: false }}
      placement="left"
      title={getMicroCopy(
        isActive
          ? microCopy.DOCUMENT_LIBRARY_LINK_COPIED_TOOLTIP_TITLE
          : microCopy.DOCUMENT_LIBRARY_COPY_LINK_TOOLTIP_TITLE
      )}
      onClose={() => setIsActive(false)}
    >
      <Box ml="auto">
        <StyledButton
          isIconButton
          variant="text"
          aria-label={`Copy ${props.title}`}
          data-testid={`document-table-actions-copy-url-${props.id}`}
          onClick={saveToClipboard}
        >
          <ActionIcon name="CopyContent" />
        </StyledButton>
      </Box>
    </Tooltip>
  );
};

export const DownloadDocumentButton = ({
  document
}: {
  document: Document;
}) => {
  const { getMicroCopy } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

  const downloadButtonConfig: {
    gtm: GTM;
    action: ClickableAction;
    onClick?: () => void;
  } = useMemo(() => {
    if (document.__typename === "PIMDocumentWithPseudoZip") {
      return {
        gtm: {
          id: "download1",
          label: "Download",
          action: JSON.stringify(
            Object.values(document.documentList).map((asset) => asset.url)
          )
        },
        action: { model: "default" },
        onClick: () =>
          downloadMultipleFiles(document, qaAuthToken, executeRecaptcha)
      };
    }

    const documentUrl = getFileUrlByDocumentType(document);
    return {
      gtm: {
        id: "download1",
        label: "Download",
        action: documentUrl
      },
      action: {
        model: "download",
        href: getDownloadLink(documentUrl)
      }
    };
  }, [document, qaAuthToken, executeRecaptcha]);

  return (
    <Tooltip
      PopperProps={{ disablePortal: true }}
      placement="left"
      title={getMicroCopy(microCopy.DOCUMENT_LIBRARY_DOWNLOAD_TOOLTIP_TITLE)}
    >
      <div>
        <GTMButton
          {...downloadButtonConfig}
          isIconButton
          variant="text"
          accessibilityLabel={`Download ${document.title}`}
          data-testid={`document-table-actions-download-${document.id}`}
        >
          <ActionIcon name="Download" />
        </GTMButton>
      </div>
    </Tooltip>
  );
};
