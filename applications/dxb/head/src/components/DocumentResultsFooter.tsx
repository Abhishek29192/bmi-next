import {
  Button,
  ButtonProps,
  Container,
  DownloadList,
  DownloadListContext,
  DownloadListContextType,
  Grid
} from "@bmi-digital/components";
import { Box } from "@mui/material";
import classnames from "classnames";
import { filesize } from "filesize";
import fetch, { Response } from "node-fetch";
import React, { useContext, useMemo } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { microCopy } from "../constants/microCopies";
import { Config, useConfig } from "../contexts/ConfigProvider";
import { DocumentResultData } from "../templates/documentLibrary/components/DocumentResults";
import { downloadAs, getDownloadLink } from "../utils/client-download";
import { devLog } from "../utils/devLog";
import getCookie from "../utils/getCookie";
import withGTM from "../utils/google-tag-manager";
import useHasScrollbar from "../utils/useHasScrollbar";
import { getFileUrlByDocumentType } from "../utils/documentUtils";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFileNamebyTitle
} from "./DocumentFileUtils";
import { useSiteContext } from "./Site";
import {
  ButtonsWrapper,
  ContentWrapper,
  DocumentResultsFooterContainer,
  ErrorMessage,
  FilesSizeInfoSection,
  MaxSizeLabel,
  ResetSelectionBtn,
  StickyContainer,
  StyledErrorIcon,
  StyledPagination,
  StyledRecaptcha,
  TotalSize,
  classes
} from "./styles/DocumentResultsFooterStyles";

type Props = {
  page: number;
  count: number;
  onPageChange?: (event: React.ChangeEvent<HTMLElement>, page: number) => void;
  isDownloadButton?: boolean;
  sticky?: boolean;
};

export const handleDownloadClick = async (
  list: Record<string, any>,
  config: Config,
  callback: () => void,
  token?: string,
  qaAuthToken?: string
) => {
  const { isPreviewMode, documentDownloadEndpoint } = config;
  const listValues = Object.values(list).filter(Boolean);
  const [currentTime] = new Date().toJSON().replace(/-|:|T/g, "").split(".");

  if (listValues.length === 0) {
    return;
  }

  if (isPreviewMode) {
    alert("You cannot download documents on the preview environment.");
    callback();
    return;
  }

  try {
    if (!documentDownloadEndpoint) {
      throw Error(
        "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
      );
    }
    const assets = listValues.flat();
    const assetFileCountMap: AssetUniqueFileCountMap =
      createAssetFileCountMap(assets);
    const documents = assets.map(
      ({ __typename, asset, extension, title, url }, index) => {
        return {
          href:
            __typename === "ContentfulDocument"
              ? getDownloadLink(asset.file.url)
              : url,
          name:
            __typename === "ContentfulDocument"
              ? `${title}.${asset.file.fileName.split(".").pop()}`
              : generateFileNamebyTitle(
                  assetFileCountMap,
                  title,
                  extension,
                  index
                )
        };
      }
    );

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

    const data = (await response.json()) as { url: string };

    await downloadAs(data.url, `BMI_${currentTime}.zip`);

    callback();
  } catch (error) {
    if (typeof error === "object" && error instanceof Error) {
      devLog(`DocumentResults: ${error.message}`);
    }
  }
};

const getListOfUrl = (item: DocumentResultData[]) => {
  return item
    .map((el) => {
      return getFileUrlByDocumentType(el);
    })
    .join(",");
};

const getAction = (list: Record<string, DocumentResultData>) => {
  return JSON.stringify(
    Object.values(list)
      .map((item) => {
        if (item) {
          if (Array.isArray(item)) {
            return getListOfUrl(item);
          } else {
            return getFileUrlByDocumentType(item);
          }
        }
      })
      .filter(Boolean)
  );
};

const DownloadDocumentsButton = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { getMicroCopy } = useSiteContext();
  const {
    resetList,
    size,
    list: selectedDocuments,
    count: selectedItemsCount,
    remainingSize
  } = useContext(DownloadListContext);
  const config = useConfig();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const downloadButtonLabel = selectedItemsCount
    ? `${getMicroCopy(microCopy.DOWNLOAD_LIST_DOWNLOAD)} ({{count}})`
    : getMicroCopy(microCopy.DOWNLOAD_LIST_DOWNLOAD);
  const maxSizeExceeded = remainingSize < 0;

  const handleButtonClick = useMemo(
    () => async (list: DownloadListContextType["list"]) => {
      const token = qaAuthToken ? undefined : await executeRecaptcha?.();
      await handleDownloadClick(list, config, resetList, token, qaAuthToken);
    },
    [config, executeRecaptcha, qaAuthToken, resetList]
  );

  const DownloadButton = useMemo(() => {
    const documentAction = getAction(selectedDocuments);
    const gtmButton = (props: ButtonProps) => {
      const GTMButton = withGTM<ButtonProps>(Button);
      return (
        <GTMButton
          gtm={{
            id: "download3-button1",
            label: Array.isArray(props.children) ? props.children[0] : "",
            action: documentAction
          }}
          {...props}
        />
      );
    };
    gtmButton.displayName = "Document-Download-Button";
    return gtmButton;
  }, [selectedDocuments]);

  return (
    <DownloadList.Button
      disabled={!size || maxSizeExceeded}
      component={DownloadButton}
      label={downloadButtonLabel}
      onClick={handleButtonClick}
      data-testid="document-table-download-button"
    />
  );
};

const DocumentResultsFooter = ({
  page,
  count,
  onPageChange,
  sticky,
  isDownloadButton = true
}: Props) => {
  const displayPagination = Boolean(count > 1 && onPageChange);

  if (sticky) {
    return (
      <StickyFooter
        showPagination={displayPagination}
        page={page}
        count={count}
        onPageChange={onPageChange}
      />
    );
  }

  return (
    <DocumentResultsFooterContainer data-testid="document-results-footer">
      {displayPagination && (
        <StyledPagination page={page} onChange={onPageChange} count={count} />
      )}
      {isDownloadButton && (
        <Box mt={4}>
          <DocumentsFooterContent />
          <StyledRecaptcha className={classes["recaptcha"]} />
        </Box>
      )}
    </DocumentResultsFooterContainer>
  );
};

type StickyFooterProps = {
  showPagination: boolean;
  page: number;
  count: number;
  onPageChange?: (event: React.ChangeEvent<HTMLElement>, page: number) => void;
};

const StickyFooter = (props: StickyFooterProps) => {
  const hasScrollbar = useHasScrollbar();

  return (
    <>
      {props.showPagination && (
        <Container disableGutters>
          <Grid container spacing={0} direction="row-reverse">
            <Grid xs={12} md={12} lg={9}>
              <StyledPagination
                page={props.page}
                count={props.count}
                onChange={props.onPageChange}
              />
            </Grid>
          </Grid>
        </Container>
      )}
      <StickyContainer
        data-testid="document-results-footer"
        hasScrollGutter={hasScrollbar}
      >
        <Container disableGutters>
          <Grid container direction="row-reverse">
            <Grid xs={12} md={12} lg={9}>
              <DocumentsFooterContent />
            </Grid>
          </Grid>
        </Container>
      </StickyContainer>
      <Grid container direction="row-reverse">
        <Grid xs={12} md={12} lg={9}>
          <StyledRecaptcha className={classes["recaptcha"]} />
        </Grid>
      </Grid>
    </>
  );
};

const DocumentsFooterContent = () => {
  const { getMicroCopy } = useSiteContext();
  const config = useConfig();
  const { remainingSize, size } = useContext(DownloadListContext);
  const maxSizeExceeded = remainingSize < 0;

  return (
    <ContentWrapper>
      <ButtonsWrapper>
        <DownloadDocumentsButton />
        <ResetSelectionBtn
          disabled={!size}
          label={getMicroCopy(microCopy.DOWNLOAD_LIST_CLEAR)}
          data-testid="document-results-footer-reset-button"
        />
      </ButtonsWrapper>
      {size ? (
        <FilesSizeInfoSection>
          <TotalSize>
            <span>
              {getMicroCopy(microCopy.DOWNLOAD_LIST_TOTAL_SIZE_LABEL)}
            </span>
            <span
              className={classnames(
                classes.totalSizeValue,
                maxSizeExceeded && classes.totalSizeExceeded
              )}
              data-testid="document-results-footer-total-size-value"
            >
              {filesize(size) as string}
            </span>
          </TotalSize>
          <MaxSizeLabel data-testid="document-results-footer-max-size-value">
            {getMicroCopy(microCopy.DOWNLOAD_LIST_MAX_SIZE, {
              maxSize: `${config.documentDownloadMaxLimit} MB`
            })}
          </MaxSizeLabel>
          {maxSizeExceeded && (
            <ErrorMessage data-testid="document-results-footer-size-exceeded-error">
              <StyledErrorIcon />
              {getMicroCopy(microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED)}
            </ErrorMessage>
          )}
        </FilesSizeInfoSection>
      ) : null}
    </ContentWrapper>
  );
};

export default DocumentResultsFooter;
