import React, { useContext } from "react";
import classnames from "classnames";
import Button, { IconButtonProps } from "@bmi/button";
import Clickable, { ClickableProps } from "@bmi/clickable";
import Icon, { iconMap } from "@bmi/icon";
import Table from "@bmi/table";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
import axios from "axios";
import { flatten } from "lodash";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { downloadAs } from "../utils/client-download";
import withGTM from "../utils/google-tag-manager";
import AssetHeader from "./_AssetHeader";
import { SiteContext } from "./Site";
import { Data as AssetTypeData } from "./AssetType";
import { Data as PIMDocumentData } from "./PIMDocument";
import { Data as PIMLinkDocumentData } from "./PIMLinkDocument";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import { Format } from "./types";

interface Props {
  documentsByProduct: [string, (PIMDocumentData | PIMLinkDocumentData)[]][];
  assetTypes: AssetTypeData[];
  fileIconsMap: Record<Format, React.ComponentType>;
}

const DesktopDocumentTechnicalTableResults = ({
  documentsByProduct,
  assetTypes,
  fileIconsMap
}: Props) => {
  const { getMicroCopy } = useContext(SiteContext);
  const { list } = useContext(DownloadListContext);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const GTMClickable = withGTM<ClickableProps>(Clickable);
  const GTMButton = withGTM<IconButtonProps>(Button);

  const singleDocument = (asset: PIMDocumentData | PIMLinkDocumentData) =>
    asset.__typename !== "PIMLinkDocument" ? (
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
          source={fileIconsMap[asset.format]}
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
      >
        <Icon
          source={iconMap.External}
          className={styles["external-link-icon"]}
        />
      </GTMButton>
    );

  const multipleDocuments = (
    assets: (PIMDocumentData | PIMLinkDocumentData)[]
  ) => {
    const downloadMultipleFiles = async () => {
      try {
        if (!process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT) {
          throw Error(
            "`GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT` missing in environment config"
          );
        }
        const [currentTime] = new Date()
          .toJSON()
          .replace(/-|:|T/g, "")
          .split(".");
        const token = await executeRecaptcha();
        const documents = assets.map((asset, index) => ({
          href: asset.url,
          name: `${asset.title}-${index}${
            asset["extension"] ? `.${asset["extension"]}` : ""
          }`
        }));
        const response = await axios.post(
          process.env.GATSBY_DOCUMENT_DOWNLOAD_ENDPOINT,
          { documents: documents },
          { responseType: "text", headers: { "X-Recaptcha-Token": token } }
        );
        await downloadAs(response.data.url, `BMI_${currentTime}.zip`);
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
          model: "default",
          onClick: downloadMultipleFiles
        }}
        gtm={{
          id: "download1",
          label: "Download",
          action: JSON.stringify(
            Object.values(assets).map((asset) => asset.url)
          )
        }}
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
              {getMicroCopy("documentLibrary.headers.product")}
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
                <span>{getMicroCopy("documentLibrary.headers.allFiles")}</span>
              </span>
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {documentsByProduct.map(([productName, assets], index) => {
            const key = `${
              assets.find(({ product }) => product.code)?.product.code
            }-${index}`;
            return (
              <Table.Row
                key={key}
                className={classnames(styles["row"], {
                  [styles["row--checked"]]: !!list[key]
                })}
              >
                <Table.Cell>{productName}</Table.Cell>
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
                  <DownloadList.Checkbox
                    name={key}
                    maxLimitReachedLabel={getMicroCopy(
                      "documents.download.maxReached"
                    )}
                    ariaLabel={`${getMicroCopy(
                      "documentLibrary.download"
                    )} ${productName}`}
                    value={assets.filter(
                      ({ __typename }) => __typename !== "PIMLinkDocument"
                    )}
                    fileSize={assets.reduce((acc, curr) => {
                      if (curr.__typename === "PIMLinkDocument") {
                        return 0;
                      }
                      return acc + (curr.fileSize || 0);
                    }, 0)}
                  />
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
