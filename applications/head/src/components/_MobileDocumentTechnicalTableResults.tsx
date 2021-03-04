import React from "react";
import Accordion from "@bmi/accordion";
import Button from "@bmi/button";
import Clickable from "@bmi/clickable";
import Icon, { iconMap } from "@bmi/icon";
import AssetHeader from "./_AssetHeader";
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

const MobileDocumentTechnicalTableResults = ({
  documentsByProduct,
  assetTypes,
  fileIconsMap
}: Props) => {
  return (
    <div className={styles["accordion-div"]}>
      <Accordion>
        {documentsByProduct.map(([productName, assets], index) => {
          const key = `${
            assets.find(({ product }) => product.code)?.product.code
          }-${index}`;
          return (
            <Accordion.Item key={key}>
              <Accordion.Summary>{productName}</Accordion.Summary>
              {assetTypes.map((assetType, index) => {
                const asset = assets.find(
                  ({ assetType: { id } }) => id === assetType.id
                );

                if (asset) {
                  return (
                    <Accordion.Details
                      key={`${productName}-asset-${asset.id}`}
                      className={styles["accordion-details"]}
                    >
                      <div className={styles["icon-container"]}>
                        {asset.__typename !== "PIMLinkDocument" ? (
                          <Icon
                            source={fileIconsMap[asset.format]}
                            className={styles["format-icon"]}
                          />
                        ) : (
                          <Icon
                            source={iconMap.External}
                            className={styles["external-link-icon"]}
                          />
                        )}
                      </div>
                      <div className={styles["icon-container"]}>
                        {assetType.code}
                      </div>
                      <div className={styles["info-icon-container"]}>
                        <AssetHeader assetType={assetType} />
                      </div>
                      <div className={styles["download-icon-container"]}>
                        {asset.__typename !== "PIMLinkDocument" ? (
                          <Clickable
                            model="download"
                            href={asset.url}
                            download={asset.title}
                          >
                            <Icon
                              source={iconMap.Download}
                              className={styles["all-files-icon"]}
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
                              source={iconMap.Download}
                              className={styles["all-files-icon"]}
                            />
                          </Button>
                        )}
                      </div>
                    </Accordion.Details>
                  );
                }
              })}
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default MobileDocumentTechnicalTableResults;
