import React from "react";
import Tabs from "@bmi/tabs";
import { Tab, TabProps } from "@material-ui/core";
import Section from "@bmi/section";
import { isEmpty } from "lodash";
import LeadBlock from "@bmi/lead-block";
import Typography from "@bmi/typography";
import { useSiteContext } from "../../components/Site";
import withGTM from "../../utils/google-tag-manager";
import BimIframe from "../../components/BimIframe";
import { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import RichText, { RichTextData } from "../../components/RichText";
import { Assets, Feature, SystemBenefits, Classification } from "./types";
import AboutLeadBlock from "./aboutLeadBlock";
import TechnicalSpecificationLeadBlock from "./technicalSpecificationLeadBlock";
import styles from "./styles/tabLeadBlock.module.scss";

export type BimContent = {
  title: string;
  description: RichTextData;
  bimIframeUrl?: string;
};

type Props = {
  longDescription: string;
  guaranteesAndWarranties?: Assets[];
  awardsAndCertificates?: Assets[];
  keyFeatures?: Feature;
  systemBenefits?: SystemBenefits;
  specification?: Assets;
  technicalSpecClassifications?: Classification[];
  documentsAndDownloads?: any;
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
      <Tabs.TabPanel heading={getMicroCopy("sdp.leadBlock.about")} index="one">
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
      {technicalSpecClassifications && !isEmpty(technicalSpecClassifications) && (
        <Tabs.TabPanel
          heading={getMicroCopy("sdp.leadBlock.technicalSpecification")}
          index="two"
        >
          <Section className={styles["section"]} backgroundColor="white">
            <TechnicalSpecificationLeadBlock
              technicalSpecClassifications={technicalSpecClassifications}
            />
          </Section>
        </Tabs.TabPanel>
      )}
      {documentsAndDownloads && !isEmpty(documentsAndDownloads) && (
        <Tabs.TabPanel
          heading={getMicroCopy("sdp.leadBlock.documentsAndDownloads")}
          index="three"
        >
          <Section className={styles["section"]} backgroundColor="white">
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores,
              recusandae.
            </div>
          </Section>
        </Tabs.TabPanel>
      )}
      {Boolean(bimContent?.bimIframeUrl) && (
        <Tabs.TabPanel heading={getMicroCopy("sdp.tabs.bim")} index="four">
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
                <BimIframe
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
