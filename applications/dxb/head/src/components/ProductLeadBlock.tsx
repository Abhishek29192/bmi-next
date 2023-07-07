import {
  AnchorLink,
  AnchorLinkProps,
  Button,
  DownloadList,
  Icon,
  IconList,
  LeadBlock,
  MediaGallery,
  replaceSpaces,
  Tabs,
  useIsClient
} from "@bmi-digital/components";
import { Check as CheckIcon, Launch } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Tab, { TabProps } from "@mui/material/Tab";
import React, { useRef, useState } from "react";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { Product } from "../types/pim";
import withGTM from "../utils/google-tag-manager";
import { transformImages } from "../utils/product-details-transforms";
import AssetsIframe from "./AssetsIframe";
import DocumentResultsFooter from "./DocumentResultsFooter";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import { getClickableActionFromUrl, isExternalUrl } from "./Link";
import ProductTechnicalSpec from "./ProductTechnicalSpec";
import { DocumentDisplayFormatType } from "./Resources";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import {
  classes,
  StyledDocumentLibrary,
  StyledDocumentSpan,
  StyledImage,
  StyledImagesContainer,
  StyledProductLeadBlockTitle,
  StyledProductDescription,
  StyledProductLeadBlock,
  StyledProductLeadTabIFrame,
  StyledTabPanel
} from "./styles/ProductLeadBlock.styles";

const StyledBlueCheckIcon = styled(Icon)(({ theme }) => ({
  color: theme.colours.accent300
}));

const BlueCheckIcon = () => {
  return <StyledBlueCheckIcon source={CheckIcon} />;
};

type Props = {
  product: Product;
  sidebarItems?:
    | {
        title: React.ReactNode;
        content: RichTextData;
      }[]
    | null;
  pdpFixingToolTitle?: string | null;
  pdpFixingToolDescription?: RichTextData | null;
  pdpSpecificationTitle?: string | null;
  pdpSpecificationDescription?: RichTextData | null;
  documentDisplayFormat?: DocumentDisplayFormatType | null;
};

const DOCUMENTS_PER_PAGE = 24;

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

const ProductLeadBlock = ({
  product,
  sidebarItems,
  pdpFixingToolTitle,
  pdpFixingToolDescription,
  pdpSpecificationTitle,
  pdpSpecificationDescription,
  documentDisplayFormat
}: Props) => {
  const { isClient } = useIsClient();
  const { documentDownloadMaxLimit } = useConfig();
  const { getMicroCopy, countryCode } = useSiteContext();
  const [page, setPage] = useState(1);
  const [documents, setDocuments] = useState(
    product.productDocuments.slice(0, 24)
  );
  const resultsElement = useRef<HTMLDivElement>(null);

  const count = Math.ceil(product.productDocuments.length / DOCUMENTS_PER_PAGE);
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
    setDocuments(product.productDocuments.slice(page, (page + 1) * 24));
  };
  const displayBy = documentDisplayFormat === "Asset name" ? "title" : "type";
  return (
    <StyledProductLeadBlock>
      <Tabs
        initialValue="one"
        tabComponent={(props: TabProps) => (
          <GTMTab
            gtm={{ id: "selector-tabs1", action: "Selector – Tabs" }}
            {...props}
          />
        )}
      >
        <Tabs.TabPanel
          heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_ABOUT)}
          index="one"
          data-testid="aboutTab"
        >
          <LeadBlock>
            <LeadBlock.Content>
              <LeadBlock.Content.Section>
                {isClient && (
                  <StyledProductDescription
                    component="div"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </LeadBlock.Content.Section>

              {(product.guaranteesAndWarrantiesImages.length > 0 ||
                product.guaranteesAndWarrantiesLinks.length > 0) && (
                <LeadBlock.Content.Section>
                  <LeadBlock.Content.Heading>
                    {getMicroCopy(
                      microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES
                    )}
                  </LeadBlock.Content.Heading>
                  {product.guaranteesAndWarrantiesImages.length > 0 && (
                    <StyledImagesContainer>
                      {product.guaranteesAndWarrantiesImages.map((item, i) => (
                        <StyledImage
                          key={`guarantee-img-${i}`}
                          src={item.url}
                          alt={item.name}
                          data-testid={`guarantee-image${
                            item.name ? `-${replaceSpaces(item.name)}` : ""
                          }`}
                        />
                      ))}
                    </StyledImagesContainer>
                  )}
                  {product.guaranteesAndWarrantiesLinks.length > 0 &&
                    product.guaranteesAndWarrantiesLinks.map((item, i) => (
                      <div key={`link-${i}`}>
                        <GTMAnchorLink
                          action={getClickableActionFromUrl(
                            null,
                            item.url,
                            countryCode,
                            undefined,
                            item.name
                          )}
                          gtm={{
                            id: "cta-click1",
                            label: item.name,
                            action: item.url
                          }}
                          iconEnd
                          isExternal={isExternalUrl(item.url)}
                          className={classes["inline-link"]}
                          data-testid={`guarantee-inline-link${
                            item.name ? `-${replaceSpaces(item.name)}` : ""
                          }`}
                        >
                          {item.name}
                        </GTMAnchorLink>
                      </div>
                    ))}
                </LeadBlock.Content.Section>
              )}
              {(product.awardsAndCertificateDocuments.length > 0 ||
                product.awardsAndCertificateImages.length > 0) && (
                <LeadBlock.Content.Section>
                  <LeadBlock.Content.Heading>
                    {getMicroCopy(microCopy.PDP_LEAD_BLOCK_AWARDS_CERTIFICATES)}
                  </LeadBlock.Content.Heading>
                  {product.awardsAndCertificateImages.length > 0 && (
                    <StyledImagesContainer>
                      {product.awardsAndCertificateImages.map((item, i) => (
                        <StyledImage
                          key={`award-img-${i}`}
                          src={item.url}
                          alt={item.name}
                        />
                      ))}
                    </StyledImagesContainer>
                  )}
                  {product.awardsAndCertificateImages.length > 0 &&
                    product.awardsAndCertificateDocuments.length > 0 && <br />}
                  {product.awardsAndCertificateDocuments.length > 0 &&
                    product.awardsAndCertificateDocuments.map((item, i) => (
                      <StyledDocumentSpan key={`award-doc-${i}`}>
                        <Button
                          variant="outlined"
                          action={{
                            model: "htmlLink",
                            href: item.url,
                            target: "_blank",
                            rel: "noopener noreferrer"
                          }}
                          endIcon={<Launch />}
                        >
                          {item.name}
                        </Button>
                      </StyledDocumentSpan>
                    ))}
                </LeadBlock.Content.Section>
              )}
            </LeadBlock.Content>
            {(product.productBenefits || sidebarItems?.length) && (
              <LeadBlock.Card
                color="blue900"
                data-testid="product-benefits-post-it-card"
              >
                {product.productBenefits ? (
                  <LeadBlock.Card.Section>
                    <LeadBlock.Card.Heading>
                      {getMicroCopy(microCopy.PDP_LEAD_BLOCK_KEY_FEATURES)}
                    </LeadBlock.Card.Heading>
                    <LeadBlock.Card.Content>
                      <IconList>
                        {product.productBenefits.map((feature, index) => (
                          <IconList.Item
                            key={`product-benefits-${index}`}
                            icon={BlueCheckIcon()}
                            title={feature}
                            isCompact
                          />
                        ))}
                      </IconList>
                    </LeadBlock.Card.Content>
                  </LeadBlock.Card.Section>
                ) : null}
                {sidebarItems?.length && (
                  <LeadBlock.Card.Section>
                    <LeadBlock.Card.Heading>
                      {sidebarItems[0].title}
                    </LeadBlock.Card.Heading>
                    <LeadBlock.Card.Content>
                      <RichText
                        document={sidebarItems[0].content}
                        theme="secondary"
                        backgroundTheme="dark"
                        gtmLabel={
                          (product.productBenefits
                            ? `${getMicroCopy(
                                microCopy.PDP_LEAD_BLOCK_KEY_FEATURES
                              )} - `
                            : "") + `${sidebarItems[0].title}`
                        }
                      />
                    </LeadBlock.Card.Content>
                  </LeadBlock.Card.Section>
                )}
              </LeadBlock.Card>
            )}
          </LeadBlock>
        </Tabs.TabPanel>
        <Tabs.TabPanel
          heading={getMicroCopy(
            microCopy.PDP_LEAD_BLOCK_TECHNICAL_SPECIFICATIONS
          )}
          index="two"
          data-testid="technicalSpecificationsTab"
        >
          <LeadBlock>
            <LeadBlock.Content>
              <ProductTechnicalSpec product={product} />
            </LeadBlock.Content>
            {sidebarItems && sidebarItems.length > 1 && (
              <LeadBlock.Card
                color="blue900"
                data-testid="technical-spec-post-it-card"
              >
                {sidebarItems.slice(1).map(({ title, content }, index) => {
                  return (
                    <LeadBlock.Card.Section key={`sidebar-item-${index}`}>
                      <LeadBlock.Card.Heading>{title}</LeadBlock.Card.Heading>
                      <LeadBlock.Card.Content>
                        <RichText
                          document={content}
                          theme="secondary"
                          backgroundTheme="dark"
                          gtmLabel={title}
                        />
                      </LeadBlock.Card.Content>
                    </LeadBlock.Card.Section>
                  );
                })}
              </LeadBlock.Card>
            )}
          </LeadBlock>
        </Tabs.TabPanel>
        {product.productDocuments?.length && (
          <Tabs.TabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_DOCUMENTS)}
            index="three"
            data-testid="documentsTab"
          >
            <StyledDocumentLibrary ref={resultsElement}>
              <DownloadList maxSize={(documentDownloadMaxLimit ?? 0) * 1000000}>
                <DocumentSimpleTableResults
                  documents={documents}
                  headers={["add", displayBy, "size", "actions"]}
                />
                <DocumentResultsFooter
                  page={page}
                  count={count}
                  onPageChange={handlePageChange}
                />
              </DownloadList>
            </StyledDocumentLibrary>
          </Tabs.TabPanel>
        )}
        {product.bimIframeUrl && (
          <Tabs.TabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_BIM)}
            index="four"
          >
            <AssetsIframe url={product.bimIframeUrl} title={"BIM iFrame"} />
          </Tabs.TabPanel>
        )}
        {product.techDrawings.length > 0 && (
          <Tabs.TabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_TECHNICAL_DRAWINGS)}
            index="five"
            data-testid="technicalDrawings"
          >
            <LeadBlock justifyContent="center">
              <LeadBlock.Content>
                <LeadBlock.Content.Section>
                  <MediaGallery
                    media={transformImages(product.techDrawings)}
                    videoButtonLabel={getMicroCopy(microCopy.MEDIA_VIDEO)}
                    visualiserButtonLabel={getMicroCopy(microCopy.MEDIA_3D)}
                    visualiserText={getMicroCopy(
                      microCopy.MEDIA_VISUALIZER_TEXT
                    )}
                  />
                </LeadBlock.Content.Section>
              </LeadBlock.Content>
            </LeadBlock>
          </Tabs.TabPanel>
        )}
        {product.specificationIframeUrl && (
          <StyledTabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_SPECIFICATION)}
            index="seven"
            data-testid="specification"
          >
            {pdpSpecificationTitle && (
              <StyledProductLeadBlockTitle variant="h5">
                {pdpSpecificationTitle}
              </StyledProductLeadBlockTitle>
            )}
            {pdpSpecificationDescription && (
              <RichText document={pdpSpecificationDescription} />
            )}
            <StyledProductLeadTabIFrame
              url={product.specificationIframeUrl}
              title={`${pdpSpecificationTitle} iFrame`}
            />
          </StyledTabPanel>
        )}
        {product.fixingToolIframeUrl && (
          <StyledTabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_FIXING_TOOL)}
            index="six"
            data-testid="fixingTool"
          >
            {pdpFixingToolTitle && (
              <StyledProductLeadBlockTitle variant="h5">
                {pdpFixingToolTitle}
              </StyledProductLeadBlockTitle>
            )}
            {pdpFixingToolDescription && (
              <RichText document={pdpFixingToolDescription} />
            )}
            <StyledProductLeadTabIFrame
              url={product.fixingToolIframeUrl}
              title={`${pdpFixingToolTitle} iFrame`}
            />
          </StyledTabPanel>
        )}
      </Tabs>
    </StyledProductLeadBlock>
  );
};
export default ProductLeadBlock;
