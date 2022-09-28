import {
  Button,
  Clickable,
  ClickableProps,
  DownloadList,
  DownloadListContext,
  Icon,
  IconButtonProps,
  iconMap,
  Table
} from "@bmi/components";
import classnames from "classnames";
import fetch, { Response } from "node-fetch";
import React, { useContext } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import createAssetFileCountMap, {
  AssetUniqueFileCountMap,
  generateFilenameByRealFileName,
  generateFileNamebyTitle
} from "../../../components/DocumentFileUtils";
import { useSiteContext } from "../../../components/Site";
import { Format } from "../../../components/types";
import { microCopy } from "../../../constants/microCopies";
import { useConfig } from "../../../contexts/ConfigProvider";
import { ContentfulAssetType as AssetTypeData } from "../../../types/AssetType";
import { ProductDocument } from "../../../types/pim";
import { downloadAs } from "../../../utils/client-download";
import withGTM from "../../../utils/google-tag-manager";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import AssetHeader from "./_AssetHeader";

interface Props {
  documentsByProduct: [string, ProductDocument[]][];
  assetTypes: AssetTypeData[];
  fileIconsMap: Record<Format, React.ComponentType>;
}

const DesktopDocumentTechnicalTableResults = ({
  documentsByProduct,
  assetTypes,
  fileIconsMap
}: Props) => {
  const {
    config: { documentDownloadEndpoint }
  } = useConfig();
  const { getMicroCopy } = useSiteContext();
  const { list } = useContext(DownloadListContext);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const GTMClickable = withGTM<ClickableProps>(Clickable);
  const GTMButton = withGTM<IconButtonProps>(Button);

  const singleDocument = (asset: ProductDocument) =>
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
      >
        <Icon
          source={fileIconsMap[asset.format] || iconMap.External}
          className={styles["format-icon"]}
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
        className={styles["external-download-button"]}
        disableTouchRipple={true}
      >
        <Icon
          source={iconMap.External}
          className={styles["external-link-icon"]}
        />
      </GTMButton>
    );

  const multipleDocuments = (assets: ProductDocument[]) => {
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

        const token = await executeRecaptcha();
        const pimDocumentAssets: ProductDocument[] = assets.filter(
          (asset): asset is ProductDocument =>
            asset.__typename === "PIMDocument"
        );
        const assetFileCountMap: AssetUniqueFileCountMap =
          createAssetFileCountMap(pimDocumentAssets);
        const documents = pimDocumentAssets.map((asset, index) => ({
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

        const response: Response = await fetch(documentDownloadEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Recaptcha-Token": token
          },
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
        }} //this doesnt seem to be called now!
        gtm={{
          id: "download1",
          label: "Download",
          action: JSON.stringify(assets.map((asset) => asset.url))
        }}
        disableTouchRipple={true}
        className={styles["external-download-button"]}
      >
        <Icon source={iconMap.FileZIP} className={styles["format-icon"]} />
      </GTMButton>
    );
  };

  return (
    <div className={styles["table-div"]}>
      <Table rowBgColorPattern="none">
        <Table.Head>
          <Table.Row className={styles["header-row"]}>
            <Table.Cell>
              {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_PRODUCT)}
            </Table.Cell>
            {assetTypes.map((assetType, index) => {
              return (
                <Table.Cell
                  key={`asset-type-${assetType.id}-${index}`}
                  className={styles["asset-type-cell"]}
                >
                  {assetType.code}
                  <AssetHeader assetType={assetType} />
                </Table.Cell>
              );
            })}
            <Table.Cell className={styles["all-files-header"]}>
              <span className={styles["all-files-header-wrapper"]}>
                <Icon
                  source={iconMap.Download}
                  className={styles["all-files-icon"]}
                />
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
              <Table.Row
                key={key}
                className={classnames(styles["row"], {
                  // eslint-disable-next-line security/detect-object-injection
                  [styles["row--checked"]]: !!list[key]
                })}
              >
                <Table.Cell>
                  {assets.length > 0 ? assets[0].productName : productName}
                </Table.Cell>
                {assetTypes.map((assetType, index) => {
                  const filteredAssets = assets.filter(
                    ({ assetType: { id } }) => id === assetType.id
                  );

                  if (!filteredAssets.length) {
                    return (
                      <Table.Cell
                        key={`${productName}-missing-asset-${index}`}
                        className={styles["align-center"]}
                      >
                        <Icon
                          source={iconMap.Cross}
                          className={styles["no-document-icon"]}
                        />
                      </Table.Cell>
                    );
                  }

                  return (
                    <Table.Cell
                      key={`${productName}-asset-${assetType.id}`}
                      className={styles["align-center"]}
                    >
                      {filteredAssets.length === 1
                        ? singleDocument(filteredAssets[0])
                        : multipleDocuments(filteredAssets)}
                    </Table.Cell>
                  );
                })}
                <Table.Cell className={styles["align-center"]}>
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
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DesktopDocumentTechnicalTableResults;
