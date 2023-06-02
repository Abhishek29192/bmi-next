import { Accordion, AccordionSummaryProps } from "@bmi-digital/components";
import { PimProductDocument } from "@bmi/elasticsearch-types";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { filesize } from "filesize";
import React from "react";
import {
  CopyToClipboard,
  DownloadDocumentButton
} from "../../../components/DocumentSimpleTableResultCommon";
import { useSiteContext } from "../../../components/Site";
import { microCopy } from "../../../constants/microCopies";
import {
  getFileSizeByDocumentType,
  getFileUrlByDocumentType,
  getIsLinkDocument
} from "../../../utils/documentUtils";
import withGTM from "../../../utils/google-tag-manager";
import { AssetType } from "../types";
import {
  ActionsContainer,
  Root,
  SizeContainer,
  SizeLabel,
  SizeValue,
  StyledAccordionSummary,
  StyledDocumentTitle,
  classes
} from "./DocumentTechnicalTableResultsStyles";

interface Props {
  documentsByProduct: [string, PimProductDocument[]][];
  assetTypes: AssetType[];
}

const GTMAccordionSummary = withGTM<AccordionSummaryProps>(
  StyledAccordionSummary
);

const MobileDocumentTechnicalTableResults = ({
  documentsByProduct,
  assetTypes
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Root className={classes["accordion-div"]}>
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

                return filteredAssets.map((asset, assetIndex) => {
                  const isLinkDocument = getIsLinkDocument(asset);

                  return (
                    <Accordion.Details
                      key={`${productName}-asset-${asset.id}-${index}-${assetIndex}`}
                      className={classes.accordionDetails}
                    >
                      <StyledDocumentTitle
                        document={asset}
                        titleField="type"
                        disableRipple={isMobile}
                      />
                      <SizeContainer>
                        <SizeLabel>
                          {getMicroCopy(
                            microCopy.DOCUMENT_LIBRARY_HEADERS_SIZE
                          )}
                          :
                        </SizeLabel>
                        <SizeValue
                          data-testid={`tech-results-accordion-size-${asset.id}`}
                        >
                          {isLinkDocument
                            ? "-"
                            : (filesize(getFileSizeByDocumentType(asset), {
                                output: "string"
                              }) as string)}
                        </SizeValue>
                      </SizeContainer>
                      <ActionsContainer>
                        {!isLinkDocument ? (
                          <Box p="12px">
                            <DownloadDocumentButton document={asset} />
                          </Box>
                        ) : null}
                        <Box p="12px" pr={0}>
                          <CopyToClipboard
                            id={asset.id}
                            url={getFileUrlByDocumentType(asset)}
                            title={asset.title}
                          />
                        </Box>
                      </ActionsContainer>
                    </Accordion.Details>
                  );
                });
              })}
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Root>
  );
};

export default MobileDocumentTechnicalTableResults;
