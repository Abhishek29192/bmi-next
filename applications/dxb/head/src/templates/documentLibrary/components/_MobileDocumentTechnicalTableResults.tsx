import {
  Accordion,
  AccordionSummaryProps,
  AnchorLink,
  AnchorLinkProps,
  Button,
  Download,
  External,
  FileUniversal,
  Icon,
  IconButtonProps
} from "@bmi-digital/components";
import { PimProductDocument } from "@bmi/elasticsearch-types";
import classnames from "classnames";
import React from "react";
import { Format } from "../../../components/types";
import withGTM from "../../../utils/google-tag-manager";
import { AssetType } from "../types";
import { classes, Root } from "./DocumentTechnicalTableResultsStyles";
import AssetHeader from "./_AssetHeader";

interface Props {
  documentsByProduct: [string, PimProductDocument[]][];
  assetTypes: AssetType[];
  fileIconsMap: Record<Format, React.ComponentType>;
}

const GTMAccordionSummary = withGTM<AccordionSummaryProps>(Accordion.Summary);
const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);
const GTMButton = withGTM<IconButtonProps>(Button);

const MobileDocumentTechnicalTableResults = ({
  documentsByProduct,
  assetTypes,
  fileIconsMap
}: Props) => {
  return (
    <Root
      className={classes["accordion-div"]}
      data-testid="mobile-tech-results-table"
    >
      <Accordion>
        {documentsByProduct.map(([productName, assets], index) => {
          const key = `${
            (
              assets.find(
                (asset) =>
                  "productBaseCode" in asset &&
                  asset.productBaseCode !== undefined
              ) as PimProductDocument | undefined
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
                const filteredAssets: PimProductDocument[] = assets.filter(
                  ({ assetType: { code } }) => code === assetType.code
                );

                return filteredAssets.map((asset, assetIndex) => (
                  <Accordion.Details
                    key={`${productName}-asset-${asset.id}-${index}-${assetIndex}`}
                    className={classes.accordionDetails}
                  >
                    <div className={classes.iconContainer}>
                      {!asset.isLinkDocument ? (
                        <Icon
                          source={fileIconsMap[asset.format] || FileUniversal}
                          className={classnames(
                            classes.formatIcon,
                            "format-icon"
                          )}
                        />
                      ) : (
                        <Icon
                          source={External}
                          className={classes.externalLinkIcon}
                        />
                      )}
                    </div>
                    <div className={classes.iconContainer}>
                      {assetType.code}
                    </div>
                    <div className={classes.infoIconContainer}>
                      <AssetHeader assetType={assetType} />
                    </div>
                    <div className={classes.downloadIconContainer}>
                      {!asset.isLinkDocument ? (
                        <GTMAnchorLink
                          href={asset.url}
                          download={asset.title}
                          gtm={{
                            id: "download1",
                            label: "Download",
                            action: asset.url
                          }}
                        >
                          <Icon
                            source={Download}
                            className={classes.allFilesIcon}
                          />
                        </GTMAnchorLink>
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
                            source={Download}
                            className={classes.allFilesIcon}
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
    </Root>
  );
};

export default MobileDocumentTechnicalTableResults;
