import {
  AnchorLink,
  AnchorLinkProps,
  Button,
  DownloadList,
  Icon,
  IconList,
  LeadBlock,
  MediaGallery,
  Tabs,
  ThemeOptions,
  Typography
} from "@bmi/components";
import Tab, { TabProps } from "@material-ui/core/Tab";
import { Launch } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/styles";
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
import styles from "./styles/ProductLeadBlock.module.scss";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      color: theme.colours.accent300
    }
  }),
  { name: "BlueCheckIcon" }
);

const BlueCheckIcon = () => {
  const classes = useStyles();
  return <Icon source={CheckIcon} className={classes.root} />;
};
type Props = {
  product: Product;
  sidebarItems?: {
    title: React.ReactNode;
    content: RichTextData;
  }[];
  pdpFixingToolTitle?: string | null;
  pdpFixingToolDescription?: RichTextData | null;
  pdpSpecificationTitle?: string | null;
  pdpSpecificationDescription?: RichTextData | null;
  documentDisplayFormat?: DocumentDisplayFormatType;
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
  const {
    config: { documentDownloadMaxLimit }
  } = useConfig();
  const { getMicroCopy, countryCode } = useSiteContext();
  const [page, setPage] = useState(1);
  const [documents, setDocuments] = useState(
    product.productDocuments.slice(0, 24)
  );
  const resultsElement = useRef<HTMLDivElement>(null);

  const count = Math.ceil(product.productDocuments.length / DOCUMENTS_PER_PAGE);
  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
    setDocuments(product.productDocuments.slice(page, (page + 1) * 24));
  };
  const displayBy = documentDisplayFormat === "Asset name" ? "title" : "type";
  return (
    <div className={styles["ProductLeadBlock"]}>
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
                <Typography
                  component="div"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </LeadBlock.Content.Section>

              {(product.guaranteesAndWarrantiesImages.length > 0 ||
                product.guaranteesAndWarrantiesLinks.length > 0) && (
                <LeadBlock.Content.Section
                  className={styles["GuaranteesAndAwardsAsset"]}
                >
                  <LeadBlock.Content.Heading>
                    {getMicroCopy(
                      microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES
                    )}
                  </LeadBlock.Content.Heading>
                  {product.guaranteesAndWarrantiesImages.length > 0 &&
                    product.guaranteesAndWarrantiesImages.map((item, i) => (
                      <img
                        key={`guarentee-img-${i}`}
                        src={item.url}
                        alt={item.name}
                        className={styles["image"]}
                      />
                    ))}
                  {product.guaranteesAndWarrantiesLinks.length > 0 &&
                    product.guaranteesAndWarrantiesLinks.map((item, i) => (
                      <div key={`link-${i}`}>
                        <GTMAnchorLink
                          action={getClickableActionFromUrl(
                            null,
                            item.url,
                            countryCode,
                            null,
                            item.name
                          )}
                          gtm={{
                            id: "cta-click1",
                            label: item.name,
                            action: item.url
                          }}
                          iconEnd
                          isExternal={isExternalUrl(item.url)}
                          className={styles["inline-link"]}
                        >
                          {item.name}
                        </GTMAnchorLink>
                      </div>
                    ))}
                </LeadBlock.Content.Section>
              )}
              {(product.awardsAndCertificateDocuments.length > 0 ||
                product.awardsAndCertificateImages.length > 0) && (
                <LeadBlock.Content.Section
                  className={styles["GuaranteesAndAwardsAsset"]}
                >
                  <LeadBlock.Content.Heading>
                    {getMicroCopy(microCopy.PDP_LEAD_BLOCK_AWARDS_CERTIFICATES)}
                  </LeadBlock.Content.Heading>
                  {product.awardsAndCertificateImages.length > 0 &&
                    product.awardsAndCertificateImages.map((item, i) => (
                      <img
                        key={`award-img-${i}`}
                        src={item.url}
                        alt={item.name}
                        className={styles["image"]}
                      />
                    ))}
                  {product.awardsAndCertificateImages.length > 0 &&
                    product.awardsAndCertificateDocuments.length > 0 && <br />}
                  {product.awardsAndCertificateDocuments.length > 0 &&
                    product.awardsAndCertificateDocuments.map((item, i) => (
                      <span
                        className={styles["document"]}
                        key={`award-doc-${i}`}
                      >
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
                      </span>
                    ))}
                </LeadBlock.Content.Section>
              )}
            </LeadBlock.Content>
            {(product.productBenefits || sidebarItems?.length) && (
              <LeadBlock.Card theme="blue900">
                {product.productBenefits ? (
                  <LeadBlock.Card.Section>
                    <LeadBlock.Card.Heading>
                      {getMicroCopy(microCopy.PDP_LEAD_BLOCK_KEY_FEATURES)}
                    </LeadBlock.Card.Heading>
                    <LeadBlock.Card.Content>
                      <IconList>
                        {product.productBenefits.map((feature, index) => (
                          <IconList.Item
                            key={index}
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
                    <LeadBlock.Card.Heading variant="h5">
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
              <LeadBlock.Card theme="blue900">
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
            <div className={styles["document-library"]} ref={resultsElement}>
              <DownloadList maxSize={documentDownloadMaxLimit * 1048576}>
                <DocumentSimpleTableResults
                  documents={documents}
                  headers={[displayBy, "download", "add"]}
                />
                <DocumentResultsFooter
                  page={page}
                  count={count}
                  onPageChange={handlePageChange}
                />
              </DownloadList>
            </div>
          </Tabs.TabPanel>
        )}
        {Boolean(product.bimIframeUrl) && (
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
                  <MediaGallery media={transformImages(product.techDrawings)} />
                </LeadBlock.Content.Section>
              </LeadBlock.Content>
            </LeadBlock>
          </Tabs.TabPanel>
        )}
        {Boolean(product.specificationIframeUrl) && (
          <Tabs.TabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_SPECIFICATION)}
            index="seven"
            data-testid="specification"
            className={styles["tab-container"]}
          >
            {pdpSpecificationTitle && (
              <Typography variant="h5" className={styles["heading"]}>
                {pdpSpecificationTitle}
              </Typography>
            )}
            {pdpSpecificationDescription && (
              <RichText document={pdpSpecificationDescription} />
            )}
            <AssetsIframe
              url={product.specificationIframeUrl}
              className={styles["specification-tab-iframe"]}
              title={`${pdpSpecificationTitle} iFrame`}
            />
          </Tabs.TabPanel>
        )}
        {Boolean(product.fixingToolIframeUrl) && (
          <Tabs.TabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_FIXING_TOOL)}
            index="six"
            data-testid="fixingTool"
            className={styles["tab-container"]}
          >
            {pdpFixingToolTitle && (
              <Typography variant="h5" className={styles["heading"]}>
                {pdpFixingToolTitle}
              </Typography>
            )}
            {pdpFixingToolDescription && (
              <RichText document={pdpFixingToolDescription} />
            )}
            <AssetsIframe
              url={product.fixingToolIframeUrl}
              className={styles["fixing-tool-iframe"]}
              title={`${pdpFixingToolTitle} iFrame`}
            />
          </Tabs.TabPanel>
        )}
      </Tabs>
    </div>
  );
};
export default ProductLeadBlock;
