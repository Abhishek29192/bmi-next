import React, { useContext, useState, useRef } from "react";
import LeadBlock from "@bmi/lead-block";
import Icon from "@bmi/icon";
import IconList from "@bmi/icon-list";
import Tabs from "@bmi/tabs";
import Table from "@bmi/table";
import Typography from "@bmi/typography";
import CheckIcon from "@material-ui/icons/Check";
import RichText from "./RichText";
import { Document } from "@contentful/rich-text-types";
import styles from "./styles/ProductLeadBlock.module.scss";
import { SiteContext } from "./Site";
import { Data as PIMDocumentData } from "./PIMDocument";
import DownloadList from "@bmi/download-list";
import DocumentResultsFooter, {
  handleDownloadClick
} from "./DocumentResultsFooter";
import DocumentSimpleTableResults from "./DocumentSimpleTableResults";

const BlueCheckIcon = <Icon source={CheckIcon} style={{ color: "#009fe3" }} />;

type GuaranteesAndAwardsAsset = {
  url: string;
  name: string;
};

type Props = {
  description?: string;
  keyFeatures?: readonly string[];
  technicalSpecifications?: {
    name: string;
    value: string;
  }[];
  sidebarItems?: {
    title: React.ReactNode;
    content: {
      json: Document;
    };
  }[];
  guaranteesAndWarranties?: GuaranteesAndAwardsAsset[];
  awardsAndCertificates?: GuaranteesAndAwardsAsset[];
  documents: PIMDocumentData[];
};

const DOCUMENTS_PER_PAGE = 24;
const MAX_DOWNLOAD_LIMIT = 10 * 1048576;

const ProductLeadBlock = ({
  description,
  keyFeatures,
  technicalSpecifications,
  sidebarItems,
  guaranteesAndWarranties,
  awardsAndCertificates,
  documents
}: Props) => {
  const { getMicroCopy } = useContext(SiteContext);
  const [page, setPage] = useState(1);
  const count = Math.ceil(documents.length / DOCUMENTS_PER_PAGE);
  const resultsElement = useRef<HTMLDivElement>(null);

  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    setPage(page);
  };

  return (
    <div className={styles["ProductLeadBlock"]}>
      <Tabs initialValue="one">
        <Tabs.TabPanel
          heading={getMicroCopy("pdp.leadBlock.about")}
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
                    {getMicroCopy("pdp.leadBlock.guaranteesWarranties")}
                  </LeadBlock.Content.Heading>
                  {guaranteesAndWarranties.map((item, i) => (
                    <img
                      key={i}
                      src={item.url}
                      alt={item.name}
                      className={styles["image"]}
                    />
                  ))}
                </LeadBlock.Content.Section>
              )}
              {awardsAndCertificates?.length > 0 && (
                <LeadBlock.Content.Section
                  className={styles["GuaranteesAndAwardsAsset"]}
                >
                  <LeadBlock.Content.Heading>
                    {getMicroCopy("pdp.leadBlock.awardsCertificates")}
                  </LeadBlock.Content.Heading>
                  {awardsAndCertificates.map((item, i) => (
                    <img
                      key={i}
                      src={item.url}
                      alt={item.name}
                      className={styles["image"]}
                    />
                  ))}
                </LeadBlock.Content.Section>
              )}
            </LeadBlock.Content>
            <LeadBlock.Card theme="blue-900">
              {keyFeatures ? (
                <LeadBlock.Card.Section>
                  <LeadBlock.Card.Heading>
                    {getMicroCopy("pdp.leadBlock.keyFeatures")}
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
                      document={sidebarItems[0].content.json}
                      theme="secondary"
                      backgroundTheme="dark"
                    />
                  </LeadBlock.Card.Content>
                </LeadBlock.Card.Section>
              )}
            </LeadBlock.Card>
          </LeadBlock>
        </Tabs.TabPanel>
        <Tabs.TabPanel
          heading={getMicroCopy("pdp.leadBlock.technicalSpecifications")}
          index="two"
        >
          <LeadBlock>
            <LeadBlock.Content>
              {technicalSpecifications && technicalSpecifications.length ? (
                <Table hasNoBorder>
                  <Table.Body>
                    {technicalSpecifications.map(({ name, value }, index) => (
                      <Table.Row key={`technical-specification-${index}`}>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{value}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                "No technical specifications found for this product."
              )}
            </LeadBlock.Content>
            {sidebarItems && sidebarItems.length > 1 && (
              <LeadBlock.Card theme="blue-900">
                {sidebarItems.slice(1).map(({ title, content }, index) => {
                  return (
                    <LeadBlock.Card.Section key={`sidebar-item-${index}`}>
                      <LeadBlock.Card.Heading>{title}</LeadBlock.Card.Heading>
                      <LeadBlock.Card.Content>
                        <RichText
                          document={content.json}
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
          heading={getMicroCopy("pdp.leadBlock.documents")}
          index="three"
        >
          <div className={styles["document-library"]} ref={resultsElement}>
            <DownloadList maxSize={MAX_DOWNLOAD_LIMIT}>
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
      </Tabs>
    </div>
  );
};

export default ProductLeadBlock;
