import Accordion, {
  AccordionSummaryProps
} from "@bmi-digital/components/accordion";
import DownloadList, {
  DownloadListContext
} from "@bmi-digital/components/download-list";
import { PimProductDocument } from "@bmi/elasticsearch-types";
import { microCopy } from "@bmi/microcopies";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { filesize } from "filesize";
import React, { useContext, useEffect } from "react";
import {
  CopyToClipboard,
  DownloadDocumentButton
} from "../../../components/DocumentSimpleTableResultCommon";
import { useSiteContext } from "../../../components/Site";
import {
  getFileSizeByDocumentType,
  getIsLinkDocument
} from "../../../utils/documentUtils";
import withGTM from "../../../utils/google-tag-manager";
import { AssetType } from "../types";
import {
  AccordionItem,
  ActionsContainer,
  Divider,
  Root,
  SizeContainer,
  SizeLabel,
  SizeValue,
  StyledAccordionSummary,
  StyledDocumentTitle,
  Title,
  classes
} from "./DocumentTechnicalTableResultsStyles";

interface Props {
  documentsByProduct: [string, PimProductDocument[]][];
  assetTypes: AssetType[];
  pageNumber?: number;
}

const GTMAccordionSummary = withGTM<AccordionSummaryProps>(
  StyledAccordionSummary
);

const MobileDocumentTechnicalTableResults = ({
  documentsByProduct,
  assetTypes,
  pageNumber = 0
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const {
    list: selectedDocuments,
    updateAllListItems,
    setSelectAllCheckboxDisabledByPage,
    setCurrentPage,
    resetAllListItems
  } = useContext(DownloadListContext);

  useEffect(() => {
    let linkDocumentsExist = false;

    setCurrentPage(pageNumber);
    resetAllListItems();

    documentsByProduct.forEach(([_, assets]) => {
      const selectableDocuments = getSelectableDocuments(assets);

      if (selectableDocuments && selectableDocuments.length !== 0) {
        updateAllListItems(
          pageNumber,
          assets[0].productBaseCode,
          selectableDocuments,
          getDocumentsSize(assets)
        );
      }

      linkDocumentsExist = linkDocumentsExist || getIsSelectionDisabled(assets);
    });

    setSelectAllCheckboxDisabledByPage(pageNumber)(linkDocumentsExist);
  }, [pageNumber, documentsByProduct]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const showDivider = useMediaQuery(theme.breakpoints.up("sm"));

  const getIsSelectionDisabled = (documents: PimProductDocument[]) =>
    documents.every(getIsLinkDocument);

  const getSelectableDocuments = (documents: PimProductDocument[]) =>
    documents.filter((document) => !getIsLinkDocument(document));

  const getDocumentsSize = (documents: PimProductDocument[]) =>
    documents.reduce(
      (acc, doc) => (getIsLinkDocument(doc) ? acc : acc + doc.fileSize),
      0
    );

  return (
    <Root className={classes["accordion-div"]}>
      <Accordion>
        {documentsByProduct.map(([productName, assets], index) => (
          <AccordionItem
            key={`${assets[0].productBaseCode}-${index}`}
            className={
              selectedDocuments[assets[0].productBaseCode] && classes.selected
            }
            data-testid={`tech-table-accordion-item-${assets[0].productBaseCode}`}
          >
            <GTMAccordionSummary
              gtm={{
                id: "selector-accordion1",
                label: productName,
                action: "Selector – Accordion"
              }}
            >
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions -- stopping interaction, not allowing*/}
              <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <DownloadList.Checkbox
                  name={assets[0].productBaseCode}
                  ariaLabel={`Select all documents for ${assets[0].productName}`}
                  disabled={getIsSelectionDisabled(assets)}
                  value={getSelectableDocuments(assets)}
                  fileSize={getDocumentsSize(assets)}
                />
              </div>
              {showDivider && (
                <Divider
                  data-testid={`tech-table-divider-${assets[0].productBaseCode}`}
                />
              )}
              <Title>{assets[0].productName}</Title>
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
                        {getMicroCopy(microCopy.DOCUMENT_LIBRARY_HEADERS_SIZE)}:
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
                          href={asset.url}
                          title={asset.title}
                        />
                      </Box>
                    </ActionsContainer>
                  </Accordion.Details>
                );
              });
            })}
          </AccordionItem>
        ))}
      </Accordion>
    </Root>
  );
};

export default MobileDocumentTechnicalTableResults;
