import React from "react";
import {
  Accordion,
  AccordionSummaryProps,
  Button,
  Clickable,
  ClickableProps,
  Icon,
  IconButtonProps,
  iconMap
} from "@bmi/components";
import {
  ProductDocument as PIMProductDocument,
  SystemDocument as PIMSystemDocument
} from "../types/pim";
import withGTM from "../utils/google-tag-manager";
import { Data as AssetTypeData } from "../types/AssetType";
import AssetHeader from "./_AssetHeader";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import { Format } from "./types";

interface Props {
  documentsByProduct: [string, (PIMProductDocument | PIMSystemDocument)[]][];
  assetTypes: AssetTypeData[];
  fileIconsMap: Record<Format, React.ComponentType>;
}

const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);
const GTMClickable = withGTM<ClickableProps>(Clickable);
const GTMButton = withGTM<IconButtonProps>(Button);

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
            (
              assets.find(
                (asset) =>
                  "productBaseCode" in asset &&
                  asset.productBaseCode !== undefined
              ) as PIMProductDocument | undefined
            )?.productBaseCode
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
                {assets.length > 0 && "productName" in assets[0]
                  ? assets[0].productName
                  : productName}
              </GTMAccordionSummary>
              {assetTypes.map((assetType, index) => {
                const filteredAssets: (
                  | PIMProductDocument
                  | PIMSystemDocument
                )[] = assets.filter(
                  ({ assetType: { id } }) => id === assetType.id
                );

                return filteredAssets.map((asset, assetIndex) => (
                  <Accordion.Details
                    key={`${productName}-asset-${asset.id}-${index}-${assetIndex}`}
                    className={styles["accordion-details"]}
                  >
                    <div className={styles["icon-container"]}>
                      {!asset.isLinkDocument ? (
                        <Icon
                          source={
                            fileIconsMap[asset.format] || iconMap.External
                          }
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
                      {!asset.isLinkDocument ? (
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
                ));
              })}
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default MobileDocumentTechnicalTableResults;
