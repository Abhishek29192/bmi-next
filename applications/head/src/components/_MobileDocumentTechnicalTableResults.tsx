import React from "react";
import Accordion, { AccordionSummaryProps } from "@bmi/accordion";
import Button, { IconButtonProps } from "@bmi/button";
import Clickable, { ClickableProps } from "@bmi/clickable";
import Icon, { iconMap } from "@bmi/icon";
import withGTM from "../utils/google-tag-manager";
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
  const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);
  const GTMClickable = withGTM<ClickableProps>(Clickable);
  const GTMButton = withGTM<IconButtonProps>(Button);

  return (
    <div className={styles["accordion-div"]}>
      <Accordion>
        {documentsByProduct.map(([productName, assets], index) => {
          const key = `${
            assets.find(({ product }) => product.code)?.product.code
          }-${index}`;
          return (
            <Accordion.Item key={key}>
              <GTMAccordionSummary
                gtm={{
                  id: "selector-accordion1",
                  label: productName,
                  action: "Selector – Accordion"
                }}
              >
                {productName}
              </GTMAccordionSummary>
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
                              source={iconMap.Download}
                              className={styles["all-files-icon"]}
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
                              source={iconMap.Download}
                              className={styles["all-files-icon"]}
                            />
                          </GTMButton>
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
