import {
  Button,
  Clickable,
  ClickableProps,
  DownloadList,
  IconButtonProps,
  Table
} from "@bmi-digital/components";
import { PimProductDocument } from "@bmi/elasticsearch-types";
import classnames from "classnames";
import fetch, { Response } from "node-fetch";
import React from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFileNamebyTitle,
  generateFilenameByRealFileName
} from "../../../components/DocumentFileUtils";
import fileIconsMap from "../../../components/FileIconsMap";
import Icon from "../../../components/Icon";
import { useSiteContext } from "../../../components/Site";
import { QA_AUTH_TOKEN } from "../../../constants/cookieConstants";
import { microCopy } from "../../../constants/microCopies";
import { useConfig } from "../../../contexts/ConfigProvider";
import { downloadAs } from "../../../utils/client-download";
import getCookie from "../../../utils/getCookie";
import withGTM from "../../../utils/google-tag-manager";
import { AssetType } from "../types";
import { Root, Title, classes } from "./DocumentTechnicalTableResultsStyles";
import AssetHeader from "./_AssetHeader";

interface Props {
  documentsByProduct: [string, PimProductDocument[]][];
  assetTypes: AssetType[];
}

const DesktopDocumentTechnicalTableResults = ({
  documentsByProduct,
  assetTypes
}: Props) => {
  const { documentDownloadEndpoint } = useConfig();
  const { getMicroCopy } = useSiteContext();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);

  const GTMClickable = withGTM<ClickableProps>(Clickable);
  const GTMButton = withGTM<IconButtonProps>(Button);

  const singleDocument = (asset: PimProductDocument) =>
    !asset.isLinkDocument ? (
      <GTMClickable
        model="download"
        href={asset.url}
        download={asset.title}
        gtm={{
          id: "download1",
          label: "Download",
          action: asset.url
        }}
        data-testid="single-document-download-link"
      >
        <Icon
          name={fileIconsMap[asset.format] || "FileUniversal"}
          className={classnames(classes.formatIcon, "format-icon")}
        />
      </GTMClickable>
    ) : (
      <GTMButton
        isIconButton
        accessibilityLabel="Download"
        variant="text"
        action={{
          model: "htmlLink",
          href: asset.url,
          target: "_blank",
          rel: "noopener noreferrer"
        }}
        gtm={{
          id: "download1",
          label: "Download",
          action: asset.url
        }}
        className={classes.externalDownloadButton}
        disableTouchRipple={true}
        data-testid="single-document-external-link"
      >
        <Icon name={"External"} className={classes.externalLinkIcon} />
      </GTMButton>
    );

  const multipleDocuments = (assets: PimProductDocument[]) => {
    // this doesnt seem to be called now!
    // TODO : remove it??

    const downloadMultipleFiles = async () => {
      try {
        if (!documentDownloadEndpoint) {
          throw Error(
            "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
          );
        }
        const [currentTime] = new Date()
          .toJSON()
          .replace(/-|:|T/g, "")
          .split(".");
        let zipFileName = `BMI_${currentTime}.zip`;
        if (assets.length > 0 && assets[0].assetType) {
          zipFileName = `${assets[0].productName} ${assets[0].assetType.name}.zip`;
        }

        const token = qaAuthToken ? undefined : await executeRecaptcha?.();
        const assetFileCountMap: AssetUniqueFileCountMap =
          createAssetFileCountMap(assets);
        const documents = assets.map((asset, index) => ({
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
        console.error("Download multiple documents", error); // eslint-disable-line
      }
    };

    return (
      <GTMButton
        isIconButton
        accessibilityLabel="Download"
        variant="text"
        action={{
          model: "default"
        }}
        onClick={() => {
          downloadMultipleFiles();
        }} //this doesn't seem to be called now!
        gtm={{
          id: "download1",
          label: "Download",
          action: JSON.stringify(assets.map((asset) => asset.url))
        }}
        disableTouchRipple={true}
        className={classes.externalDownloadButton}
      >
        <Icon name={"FileZIP"} className={classes.formatIcon} />
      </GTMButton>
    );
  };

  return (
    <Root data-testid="desktop-tech-results-table">
      <Table rowBgColorPattern="none">
        <Table.Head>
          <Table.Row className={classes.headerRow}>
            <Table.Cell>
              {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_PRODUCT)}
            </Table.Cell>
            {assetTypes.map((assetType, index) => {
              return (
                <Table.Cell
                  key={`asset-type-${assetType.code}-${index}`}
                  className={classes.assetTypeCell}
                >
                  {assetType.code}
                  <AssetHeader assetType={assetType} />
                </Table.Cell>
              );
            })}
            <Table.Cell
              className={classes.allFilesHeader}
              data-testid="download-file"
            >
              <span className={classes.allFilesHeaderWrapper}>
                <Icon name={"Download"} className={classes.allFilesIcon} />
                <span>
                  {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_ALL_FILES)}
                </span>
              </span>
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {documentsByProduct.map(([productName, assets], index) => {
            const key = `${
              assets.find((asset) => asset.productBaseCode)?.productBaseCode
            }-${index}`;
            const hasOnlyExternalAssets = assets.every(
              (asset) => asset.isLinkDocument
            );
            return (
              <Table.Row key={key}>
                <Title>
                  {assets.length > 0 ? assets[0].productName : productName}
                </Title>
                {assetTypes.map((assetType, index) => {
                  const filteredAssets = assets.filter(
                    ({ assetType: { code } }) => code === assetType.code
                  );

                  if (!filteredAssets.length) {
                    return (
                      <Table.Cell
                        key={`${productName}-missing-asset-${index}`}
                        className={classes.alignCenter}
                        data-testid={`file-does-not-exist-${productName}-missing-asset-${index}`}
                      >
                        <Icon
                          name={"Cross"}
                          className={classes.noDocumentIcon}
                        />
                      </Table.Cell>
                    );
                  }

                  return (
                    <Table.Cell
                      key={`${productName}-asset-${assetType.code}`}
                      className={classes.alignCenter}
                      data-testid={`download-file-icon-${productName}-asset-${assetType.code}`}
                    >
                      {filteredAssets.length === 1
                        ? singleDocument(filteredAssets[0])
                        : multipleDocuments(filteredAssets)}
                    </Table.Cell>
                  );
                })}
                <Table.Cell className={classes.alignCenter}>
                  {!hasOnlyExternalAssets && (
                    <DownloadList.Checkbox
                      name={key}
                      maxLimitReachedLabel={getMicroCopy(
                        microCopy.DOCUMENTS_DOWNLOAD_MAX_REACHED
                      )}
                      ariaLabel={`${getMicroCopy(
                        microCopy.DOCUMENT_LIBRARY_DOWNLOAD
                      )} ${productName}`}
                      value={assets.filter((asset) => !asset.isLinkDocument)}
                      fileSize={assets.reduce((acc, curr) => {
                        if (curr.isLinkDocument) {
                          return 0;
                        }
                        return acc + (curr.fileSize || 0);
                      }, 0)}
                      data-testid={`download-file-checkbox-${key}`}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Root>
  );
};

export default DesktopDocumentTechnicalTableResults;
