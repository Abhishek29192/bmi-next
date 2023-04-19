import {
  Button,
  ButtonProps,
  ClickableAction,
  Typography
} from "@bmi-digital/components";
import { GetApp } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import classnames from "classnames";
import filesize from "filesize";
import React from "react";
import { microCopy } from "../constants/microCopies";
import { PseudoZipPIMDocument } from "../types/pim";
import { getDownloadLink } from "../utils/client-download";
import withGTM from "../utils/google-tag-manager";
import { Document, DocumentTableHeader } from "../types/Document";
import {
  FileDownloadButtonProps,
  mapAssetToFileDownload
} from "../utils/documentUtils";
import { MultipleAssetToFileDownload } from "./DocumentSimpleTableResultCommon";
import fileIconsMap from "./FileIconsMap";
import Icon from "./Icon";
import { useSiteContext } from "./Site";

type ListProps = {
  documents: readonly Document[];
  headers: DocumentTableHeader[];
};

const GTMButton = withGTM<
  ButtonProps & {
    action?: ClickableAction;
  }
>(Button);

const StyledListItem = styled("div")(({ theme }) => ({
  padding: "20px 0 12px",
  position: "relative",
  minHeight: "126px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  "&:nth-child(2n + 1)": {
    "&::before": {
      content: "''",
      display: "block",
      position: "absolute",
      left: "-20px",
      right: "-20px",
      bottom: 0,
      top: 0,
      "background-color": theme.colours.pearl
    }
  }
}));

const StyledListTitleRow = styled("div")(({ theme }) => ({
  display: "flex",
  position: "relative"
}));

const StyledListRow = styled("div")(({ theme }) => ({
  color: theme.colours.slate,
  fontSize: "16px",
  padding: "8px 0",
  position: "relative"
}));

const StyledListDownloadRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative"
}));

const StyledDocumentTitle = styled(Typography)(({ theme }) => ({
  lineHeight: "31px",
  color: theme.colours.slate,
  paddingTop: "5px",
  fontFamily: "Effra Medium",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden"
}));

const StyledDocumentType = styled(Typography)(({ theme }) => ({
  color: theme.colours.slate,
  lineHeight: "19px"
}));

const StyledListIcon = styled("div")(({ theme }) => ({
  marginRight: "12px",
  display: "flex"
}));

const StyledExternalLinkIcon = styled(Icon)(({ theme }) => ({
  fill: theme.colours.inter,
  width: "16px",
  height: "16px",
  margin: "6px 8px"
}));

const StyledDownloadIcon = styled(Icon)(({ theme }) => ({
  width: "32px",
  height: "32px"
}));

const MultipleDocumentsToZipFile = ({
  document
}: {
  document: PseudoZipPIMDocument;
}) => {
  return (
    <StyledListItem>
      <StyledListTitleRow>
        <StyledListIcon>
          <StyledDownloadIcon
            name={"FileZIP"}
            className={classnames("download-icon")}
            data-testid={"download-icon"}
          />
        </StyledListIcon>
        <StyledDocumentTitle>{document.assetType.name}</StyledDocumentTitle>
      </StyledListTitleRow>
      <StyledListDownloadRow>
        <StyledDocumentType>{document.assetType.name}</StyledDocumentType>
        <MultipleAssetToFileDownload document={document} />
      </StyledListDownloadRow>
    </StyledListItem>
  );
};

const ListItem = ({
  asset,
  headers
}: {
  asset: FileDownloadButtonProps;
  headers: DocumentTableHeader[];
}) => {
  const { getMicroCopy } = useSiteContext();
  return (
    <StyledListItem>
      <StyledListTitleRow>
        {!asset.isLinkDocument && (
          <StyledListIcon>
            <StyledDownloadIcon
              name={fileIconsMap[asset.format] || "External"}
              className={classnames("download-icon")}
              data-testid={"download-icon"}
            />
          </StyledListIcon>
        )}
        <StyledDocumentTitle>{asset.title}</StyledDocumentTitle>
      </StyledListTitleRow>
      {headers.includes("productStatus") ? (
        <StyledListRow>
          {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_PRODUCT_STATUS)}:{" "}
          {asset.productStatus}
        </StyledListRow>
      ) : null}
      {headers.includes("validityDate") ? (
        <StyledListRow>
          {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_VALIDITY_DATE)}:{" "}
          {asset.validUntil}
        </StyledListRow>
      ) : null}
      <StyledListDownloadRow>
        <StyledDocumentType>{asset.assetTypeName}</StyledDocumentType>
        {!asset.isLinkDocument ? (
          <GTMButton
            gtm={{
              id: "download1",
              label: "Download",
              action: asset.url
            }}
            variant="text"
            endIcon={<GetApp />}
            action={{
              model: "download",
              href: getDownloadLink(asset.url)
            }}
          >
            {filesize(asset.size)}
          </GTMButton>
        ) : (
          <Button
            isIconButton
            variant="text"
            size="small"
            action={{
              model: "htmlLink",
              href: asset.url,
              target: "_blank",
              rel: "noopener noreferrer"
            }}
          >
            <StyledExternalLinkIcon name={"ExternalMobile"} />
          </Button>
        )}
      </StyledListDownloadRow>
    </StyledListItem>
  );
};

export const DocumentSimpleTableResultsMobile = ({
  documents,
  headers
}: ListProps): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();

  const list = documents.map((document, index) => {
    if (document.__typename === "PIMDocumentWithPseudoZip") {
      const key = `${document.__typename}-${index}`;
      return <MultipleDocumentsToZipFile key={key} document={document} />;
    }
    return (
      <ListItem
        headers={headers}
        asset={mapAssetToFileDownload(document, getMicroCopy)}
        key={document.id}
      />
    );
  });

  return <div>{list}</div>;
};
