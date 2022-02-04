import React from "react";
import Tabs from "@bmi/tabs";
import Tab, { TabProps } from "@material-ui/core/Tab";
import Section from "@bmi/section";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import { useSiteContext } from "../../components/Site";
import withGTM from "../../utils/google-tag-manager";
import { microCopy } from "../../constants/microCopies";
import AssetsIframe from "../../components/AssetsIframe";
import { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import RichText, { RichTextData } from "../../components/RichText";
import { Asset, Feature, Classification } from "../../components/types/pim";
import { DocumentData } from "./types";
import AboutLeadBlock from "./aboutLeadBlock";
import TechnicalSpecificationLeadBlock from "./technicalSpecificationLeadBlock";
import styles from "./styles/tabLeadBlock.module.scss";
import DocumentLeadBlock from "./documentsLeadBlock";

export type BimContent = {
  title: string;
  description: RichTextData;
  bimIframeUrl?: string;
};

type Props = {
  longDescription: string;
  guaranteesAndWarranties?: Asset[];
  awardsAndCertificates?: Asset[];
  keyFeatures?: Feature;
  systemBenefits?: string[];
  specification?: Asset;
  technicalSpecClassifications?: Classification[];
  documentsAndDownloads?: DocumentData[];
  aboutLeadBlockGenericContent?: ContentfulTitleWithContent;
  bimContent?: BimContent;
};

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const TabLeadBlock = ({
  longDescription,
  guaranteesAndWarranties,
  awardsAndCertificates,
  keyFeatures,
  systemBenefits,
  specification,
  technicalSpecClassifications,
  documentsAndDownloads,
  aboutLeadBlockGenericContent,
  bimContent
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <Tabs
      className={styles["sdpTabLeadBlock"]}
      initialValue="one"
      tabComponent={(props: TabProps) => (
        <GTMTab
          gtm={{ id: "selector-tabs1", action: "Selector – Tabs" }}
          {...props}
        />
      )}
    >
      <Tabs.TabPanel
        heading={getMicroCopy(microCopy.SDP_LEAD_BLOCK_ABOUT)}
        index="one"
      >
        <Section className={styles["section"]} backgroundColor="white">
          <AboutLeadBlock
            longDescription={longDescription}
            guaranteesAndWarranties={guaranteesAndWarranties}
            awardsAndCertificates={awardsAndCertificates}
            keyFeatures={keyFeatures}
            systemBenefits={systemBenefits}
            specification={specification}
            sidebarItem={aboutLeadBlockGenericContent}
          />
        </Section>
      </Tabs.TabPanel>
      {technicalSpecClassifications?.length && (
        <Tabs.TabPanel
          heading={getMicroCopy(
            microCopy.SDP_LEAD_BLOCK_TECHNICAL_SPECIFICATION
          )}
          index="two"
        >
          <Section className={styles["section"]} backgroundColor="white">
            <TechnicalSpecificationLeadBlock
              technicalSpecClassifications={technicalSpecClassifications}
            />
          </Section>
        </Tabs.TabPanel>
      )}
      {documentsAndDownloads?.length && (
        <Tabs.TabPanel
          heading={getMicroCopy(
            microCopy.SDP_LEAD_BLOCK_DOCUMENTS_AND_DOWNLOADS
          )}
          index="three"
        >
          <Section className={styles["section"]} backgroundColor="white">
            <DocumentLeadBlock documents={documentsAndDownloads} />
          </Section>
        </Tabs.TabPanel>
      )}
      {Boolean(bimContent?.bimIframeUrl) && (
        <Tabs.TabPanel
          heading={getMicroCopy(microCopy.SDP_TABS_BIM)}
          index="four"
        >
          <div className={styles["bimLeadBlock"]}>
            <Section className={styles["section"]} backgroundColor="pearl">
              <LeadBlock>
                <LeadBlock.Content>
                  <LeadBlock.Content.Section>
                    <LeadBlock.Content.Heading>
                      <Typography hasUnderline={true} variant="h2">
                        {bimContent.title}
                      </Typography>
                    </LeadBlock.Content.Heading>
                  </LeadBlock.Content.Section>
                  <LeadBlock.Content.Section>
                    <RichText document={bimContent.description} />
                  </LeadBlock.Content.Section>
                </LeadBlock.Content>
                <AssetsIframe
                  data-testid="bmi-iframe"
                  className={styles["bmiIframe"]}
                  url={bimContent.bimIframeUrl}
                />
              </LeadBlock>
            </Section>
          </div>
        </Tabs.TabPanel>
      )}
    </Tabs>
  );
};

export default TabLeadBlock;
