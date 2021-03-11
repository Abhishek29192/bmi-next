import React, { useContext } from "react";
import classnames from "classnames";
import Button from "@bmi/button";
import Clickable from "@bmi/clickable";
import Icon, { iconMap } from "@bmi/icon";
import Table from "@bmi/table";
import DownloadList, { DownloadListContext } from "@bmi/download-list";
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
                  const asset = assets.find(
                    ({ assetType: { id } }) => id === assetType.id
                  );

                  if (!asset) {
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
                      key={`${productName}-asset-${asset.id}`}
                      className={styles["align-center"]}
                    >
                      {asset.__typename !== "PIMLinkDocument" ? (
                        <Clickable
                          model="download"
                          href={asset.url}
                          download={asset.title}
                        >
                          <Icon
                            source={fileIconsMap[asset.format]}
                            className={styles["format-icon"]}
                          />
                        </Clickable>
                      ) : (
                        <Button
                          isIconButton
                          variant="text"
                          action={{
                            model: "htmlLink",
                            href: asset.url,
                            target: "_blank",
                            rel: "noopener noreferrer"
                          }}
                        >
                          <Icon
                            source={iconMap.External}
                            className={styles["external-link-icon"]}
                          />
                        </Button>
                      )}
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
