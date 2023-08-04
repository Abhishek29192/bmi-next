import {
  ButtonProps,
  ClickableAction,
  IconButtonProps,
  Tooltip
} from "@bmi-digital/components";
import { Box } from "@mui/material";
import classnames from "classnames";
import React, { useMemo, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { microCopy } from "@bmi/microcopies";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { Document, TitleField } from "../types/Document";
import { PseudoZipPIMDocument } from "../types/pim";
import { getDownloadLink } from "../utils/client-download";
import {
  downloadMultipleFiles,
  getFileUrlByDocumentType,
  mapAssetToFileDownload
} from "../utils/documentUtils";
import getCookie from "../utils/getCookie";
import withGTM, { GTM } from "../utils/google-tag-manager";
import fileIconsMap from "./FileIconsMap";
import { useSiteContext } from "./Site";
import {
  ActionIcon,
  ExternalLinkIcon,
  StyledButton,
  StyledIcon,
  Title,
  TitleButton,
  TooltipPopper,
  classes
} from "./styles/DocumentSimpleTableResultsCommonStyles";

type ButtonSizes = "small" | "large";

interface CopyToClipboardProps {
  id: string;
  url: string;
  title: string;
  size?: ButtonSizes;
}

interface DownloadDocumentButtonProps {
  document: Document;
  size?: ButtonSizes;
}

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
    <GTMDocumentTitleButton
      disableRipple={disableRipple}
      className={classnames(className, disableRipple && classes.disableRipple)}
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
          <StyledIcon name={"FileZIP"} className={"download-icon"} />
        )
      }
      data-testid={`document-table-download-zip-button`}
    >
      <Title>{title}</Title>
    </GTMDocumentTitleButton>
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
        action={{
          model: "htmlLink",
          href: mappedDocument.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }}
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
    <GTMDocumentTitleButton
      disableRipple={props.disableRipple}
      className={classnames(
        props.className,
        props.disableRipple && classes.disableRipple
      )}
      gtm={{ id: "download1", label: "Download", action: mappedDocument.url }}
      action={{
        model: "download",
        href: getDownloadLink(mappedDocument.url) || ""
      }}
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
    </GTMDocumentTitleButton>
  );
};

export const CopyToClipboard = ({
  url,
  title,
  id,
  size = "small"
}: CopyToClipboardProps) => {
  const { getMicroCopy } = useSiteContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);

  const saveToClipboard = async (): Promise<void> => {
    const downloadLink = getDownloadLink(url);
    await navigator.clipboard.writeText(downloadLink ?? "");
    setIsLinkCopied(true);
    setIsOpen(true);
  };

  const handleTooltipClose = () => {
    setIsOpen(false);
    setIsLinkCopied(false);
  };

  return (
    <Tooltip
      PopperProps={{ disablePortal: true }}
      TransitionProps={{ exit: false }}
      open={isOpen}
      leaveTouchDelay={5000}
      onOpen={() => setIsOpen(true)}
      placement="left"
      title={getMicroCopy(
        isLinkCopied
          ? microCopy.DOCUMENT_LIBRARY_LINK_COPIED_TOOLTIP_TITLE
          : microCopy.DOCUMENT_LIBRARY_COPY_LINK_TOOLTIP_TITLE
      )}
      onClose={handleTooltipClose}
      components={{
        Tooltip: TooltipPopper
      }}
    >
      <Box ml={{ lg: "auto" }}>
        <StyledButton
          isIconButton
          variant="text"
          accessibilityLabel={`Copy ${title}`}
          data-testid={`document-table-actions-copy-url-${id}`}
          onClick={saveToClipboard}
          size={size}
        >
          <ActionIcon
            className={
              size === "small" ? classes["actionIconSmall"] : undefined
            }
            name="CopyContent"
          />
        </StyledButton>
      </Box>
    </Tooltip>
  );
};

export const DownloadDocumentButton = ({
  document,
  size = "small"
}: DownloadDocumentButtonProps) => {
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
      disableTouchListener
      title={getMicroCopy(microCopy.DOCUMENT_LIBRARY_DOWNLOAD_TOOLTIP_TITLE)}
      components={{
        Tooltip: TooltipPopper
      }}
    >
      <div>
        <GTMButton
          {...downloadButtonConfig}
          isIconButton
          variant="text"
          accessibilityLabel={`Download ${document.title}`}
          data-testid={`document-table-actions-download-${document.id}`}
          size={size}
        >
          <ActionIcon
            className={
              size === "small" ? classes["actionIconSmall"] : undefined
            }
            name="Download"
          />
        </GTMButton>
      </div>
    </Tooltip>
  );
};
