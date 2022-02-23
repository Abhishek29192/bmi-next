import React, { useRef, useState } from "react";
import { LeadBlock } from "@bmi/components";
import { Button } from "@bmi/components";
import { IconList } from "@bmi/components";
import { Tabs } from "@bmi/components";
import { Typography } from "@bmi/components";
import { DownloadList } from "@bmi/components";
import { Icon } from "@bmi/components";
import { ImageGallery, Image } from "@bmi/components";
import { AnchorLink, AnchorLinkProps } from "@bmi/components";
import { Launch } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import Tab, { TabProps } from "@material-ui/core/Tab";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import RichText, { RichTextData } from "./RichText";
import styles from "./styles/ProductLeadBlock.module.scss";
import { useSiteContext } from "./Site";
import { PIMDocumentData, PIMLinkDocumentData } from "./types/PIMDocumentBase";
import DocumentResultsFooter, {
  handleDownloadClick
} from "./DocumentResultsFooter";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";
import { Asset, Classification } from "./types/pim";
import ProductTechnicalSpec from "./ProductTechnicalSpec";
import AssetsIframe from "./AssetsIframe";
import { getClickableActionFromUrl } from "./Link";

const BlueCheckIcon = (
  <Icon source={CheckIcon} style={{ color: "var(--color-theme-accent-300)" }} />
);
type Props = {
  bimIframeUrl?: string;
  description?: string;
  keyFeatures?: readonly string[];
  sidebarItems?: {
    title: React.ReactNode;
    content: RichTextData;
  }[];
  guaranteesAndWarranties?: Asset[];
  awardsAndCertificates?: Asset[];
  documents: (PIMDocumentData | PIMLinkDocumentData)[];
  validClassifications: Classification[];
  classificationNamespace: string;
  techDrawings: readonly Image[];
  fixingToolIframeUrl?: string;
  pdpFixingToolTitle?: string | null;
  pdpFixingToolDescription?: RichTextData | null;
  specificationIframeUrl?: string;
  pdpSpecificationTitle?: string | null;
  pdpSpecificationDescription?: RichTextData | null;
};

const DOCUMENTS_PER_PAGE = 24;
const GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT =
  +process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT || 100;

const ProductLeadBlock = ({
  bimIframeUrl,
  description,
  keyFeatures,
  sidebarItems,
  guaranteesAndWarranties,
  awardsAndCertificates,
  documents,
  validClassifications,
  classificationNamespace,
  techDrawings,
  fixingToolIframeUrl,
  pdpFixingToolTitle,
  pdpFixingToolDescription,
  specificationIframeUrl,
  pdpSpecificationTitle,
  pdpSpecificationDescription
}: Props) => {
  const { getMicroCopy, countryCode } = useSiteContext();
  const [page, setPage] = useState(1);
  const count = Math.ceil(documents.length / DOCUMENTS_PER_PAGE);
  const resultsElement = useRef<HTMLDivElement>(null);

  const isImageAsset = (asset: Asset) => {
    return (
      asset.realFileName?.indexOf(".jpg") > -1 ||
      asset.realFileName?.indexOf(".png") > -1
    );
  };
  const isPDFAsset = (asset: Asset) => {
    return (
      asset.url?.indexOf(".pdf") > -1 ||
      asset.realFileName?.indexOf(".pdf") > -1
    );
  };

  const guaranteesAndWarrantiesLinks = (guaranteesAndWarranties || []).filter(
    (item) => !isPDFAsset(item) && !isImageAsset(item)
  );
  const guaranteesImages = guaranteesAndWarranties?.filter((item) =>
    isImageAsset(item)
  );

  const awardsDocs = (awardsAndCertificates || []).filter((item) =>
    isPDFAsset(item)
  );
  const awardsImages = (awardsAndCertificates || []).filter(
    (item) => !isPDFAsset(item)
  );

  const GTMTab = withGTM<TabProps>(Tab, {
    label: "label"
  });

  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
  };
  const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

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
        >
          <LeadBlock>
            <LeadBlock.Content>
              <LeadBlock.Content.Section>
                <Typography
                  component="div"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </LeadBlock.Content.Section>

              {guaranteesAndWarranties?.length > 0 && (
                <LeadBlock.Content.Section
                  className={styles["GuaranteesAndAwardsAsset"]}
                >
                  <LeadBlock.Content.Heading>
                    {getMicroCopy(
                      microCopy.PDP_LEAD_BLOCK_GUARANTEES_WARRANTIES
                    )}
                  </LeadBlock.Content.Heading>
                  {guaranteesImages?.map((item, i) => (
                    <img
                      key={`guarentee-img-${i}`}
                      src={item.url}
                      alt={item.name}
                      className={styles["image"]}
                    />
                  ))}
                  {guaranteesAndWarrantiesLinks?.map((item, i) => (
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
                        className={styles["inline-link"]}
                      >
                        {item.name}
                      </GTMAnchorLink>
                    </div>
                  ))}
                </LeadBlock.Content.Section>
              )}
              {awardsAndCertificates?.length > 0 && (
                <LeadBlock.Content.Section
                  className={styles["GuaranteesAndAwardsAsset"]}
                >
                  <LeadBlock.Content.Heading>
                    {getMicroCopy(microCopy.PDP_LEAD_BLOCK_AWARDS_CERTIFICATES)}
                  </LeadBlock.Content.Heading>
                  {awardsImages.map((item, i) => (
                    <img
                      key={`award-img-${i}`}
                      src={item.url}
                      alt={item.name}
                      className={styles["image"]}
                    />
                  ))}
                  {awardsImages.length > 0 && awardsDocs.length > 0 && <br />}
                  {awardsDocs.map((item, i) => (
                    <span className={styles["document"]} key={`award-doc-${i}`}>
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
            {(keyFeatures || sidebarItems?.length) && (
              <LeadBlock.Card theme="blue-900">
                {keyFeatures ? (
                  <LeadBlock.Card.Section>
                    <LeadBlock.Card.Heading>
                      {getMicroCopy(microCopy.PDP_LEAD_BLOCK_KEY_FEATURES)}
                    </LeadBlock.Card.Heading>
                    <LeadBlock.Card.Content>
                      <IconList>
                        {keyFeatures.map((feature, index) => (
                          <IconList.Item
                            key={index}
                            icon={BlueCheckIcon}
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
        >
          <LeadBlock>
            <LeadBlock.Content>
              <ProductTechnicalSpec
                classificationNamespace={classificationNamespace}
                classifications={validClassifications}
              />
            </LeadBlock.Content>
            {sidebarItems && sidebarItems.length > 1 && (
              <LeadBlock.Card theme="blue-900">
                {sidebarItems.slice(1).map(({ title, content }, index) => {
                  return (
                    <LeadBlock.Card.Section key={`sidebar-item-${index}`}>
                      <LeadBlock.Card.Heading>{title}</LeadBlock.Card.Heading>
                      <LeadBlock.Card.Content>
                        <RichText
                          document={content}
                          theme="secondary"
                          backgroundTheme="dark"
                        />
                      </LeadBlock.Card.Content>
                    </LeadBlock.Card.Section>
                  );
                })}
              </LeadBlock.Card>
            )}
          </LeadBlock>
        </Tabs.TabPanel>
        <Tabs.TabPanel
          heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_DOCUMENTS)}
          index="three"
        >
          <div className={styles["document-library"]} ref={resultsElement}>
            <DownloadList
              maxSize={GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT * 1048576}
            >
              <DocumentSimpleTableResults
                documents={documents}
                page={page}
                documentsPerPage={DOCUMENTS_PER_PAGE}
                headers={["type", "download", "add"]}
              />
              <DocumentResultsFooter
                page={page}
                count={count}
                onDownloadClick={handleDownloadClick}
                onPageChange={handlePageChange}
              />
            </DownloadList>
          </div>
        </Tabs.TabPanel>
        {Boolean(bimIframeUrl) && (
          <Tabs.TabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_BIM)}
            index="four"
          >
            <AssetsIframe url={bimIframeUrl} />
          </Tabs.TabPanel>
        )}
        {techDrawings.length > 0 && (
          <Tabs.TabPanel
            heading={getMicroCopy(microCopy.PDP_LEAD_BLOCK_TECHNICAL_DRAWINGS)}
            index="five"
            data-testid="technicalDrawings"
          >
            <LeadBlock justify="center">
              <LeadBlock.Content>
                <LeadBlock.Content.Section>
                  <ImageGallery images={techDrawings} />
                </LeadBlock.Content.Section>
              </LeadBlock.Content>
            </LeadBlock>
          </Tabs.TabPanel>
        )}
        {Boolean(specificationIframeUrl) && (
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
              url={specificationIframeUrl}
              className={styles["specification-tab-iframe"]}
            />
          </Tabs.TabPanel>
        )}
        {Boolean(fixingToolIframeUrl) && (
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
              url={fixingToolIframeUrl}
              className={styles["fixing-tool-iframe"]}
            />
          </Tabs.TabPanel>
        )}
      </Tabs>
    </div>
  );
};

export default ProductLeadBlock;
