import LeadBlock from "@bmi-digital/components/lead-block";
import Section from "@bmi-digital/components/section";
import Tabs from "@bmi-digital/components/tabs";
import { microCopy } from "@bmi/microcopies";
import Tab, { TabProps } from "@mui/material/Tab";
import React from "react";
import { Data as SDPSpecificationNotesData } from "../../components/ContentfulSpecificationNotes";
import RichText, { RichTextData } from "../../components/RichText";
import { useSiteContext } from "../../components/Site";
import { Data as ContentfulTitleWithContent } from "../../components/TitleWithContent";
import { System } from "../../types/pim";
import withGTM from "../../utils/google-tag-manager";
import AboutLeadBlock from "./aboutLeadBlock";
import DocumentLeadBlock from "./documentsLeadBlock";
import {
  StyledSDPTabLeadBlock,
  StyledSDPTabLeadBlockAssetIframe
} from "./styles/tabLeadBlock.styles";
import TechnicalSpecificationLeadBlock from "./technicalSpecificationLeadBlock";

type Props = {
  system: System;
  aboutLeadBlockGenericContent?: ContentfulTitleWithContent;
  specificationNotes?: SDPSpecificationNotesData | null;
  bimDescription?: RichTextData;
};

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const TabLeadBlock = ({
  system,
  aboutLeadBlockGenericContent,
  specificationNotes,
  bimDescription
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <StyledSDPTabLeadBlock
      initialValue="one"
      tabComponent={(props: TabProps) => (
        <GTMTab
          gtm={{ id: "selector-tabs4", action: "Selector – Tabs" }}
          {...props}
        />
      )}
    >
      <Tabs.TabPanel
        heading={getMicroCopy(microCopy.SDP_LEAD_BLOCK_ABOUT)}
        index="one"
        data-testid="tab-panel-lead-block-about"
      >
        <Section
          backgroundColor="white"
          data-testid="tab-system-about-lead-block-section"
        >
          <AboutLeadBlock
            system={system}
            sidebarItem={aboutLeadBlockGenericContent}
          />
        </Section>
      </Tabs.TabPanel>
      {system.classifications?.length && (
        <Tabs.TabPanel
          heading={getMicroCopy(
            microCopy.SDP_LEAD_BLOCK_TECHNICAL_SPECIFICATION
          )}
          index="two"
          data-testid="tab-panel-lead-block-technical-specification"
        >
          <Section
            backgroundColor="white"
            data-testid="tab-system-tech-spec-lead-block-section"
          >
            <TechnicalSpecificationLeadBlock
              specificationNotes={specificationNotes}
              technicalSpecClassifications={system.classifications}
            />
          </Section>
        </Tabs.TabPanel>
      )}
      {system.documents?.length && (
        <Tabs.TabPanel
          heading={getMicroCopy(
            microCopy.SDP_LEAD_BLOCK_DOCUMENTS_AND_DOWNLOADS
          )}
          index="three"
          data-testid="tab-panel-lead-block-documents-and-downloads"
        >
          <DocumentLeadBlock documents={system.documents} />
        </Tabs.TabPanel>
      )}
      {system.bim && (
        <Tabs.TabPanel
          heading={getMicroCopy(microCopy.SDP_TABS_BIM)}
          index="four"
          data-testid="tab-panel-lead-block-bim"
        >
          <div>
            <Section
              backgroundColor="pearl"
              data-testid="tab-system-bim-lead-block-section"
            >
              <LeadBlock>
                <LeadBlock.Content>
                  <LeadBlock.Content.Heading hasUnderline={true} variant="h2">
                    {system.bim.name}
                  </LeadBlock.Content.Heading>
                  <LeadBlock.Content.Section>
                    <RichText document={bimDescription} />
                  </LeadBlock.Content.Section>
                </LeadBlock.Content>
                <StyledSDPTabLeadBlockAssetIframe
                  data-testid="bmi-iframe"
                  url={system.bim.url}
                  title={system.bim.name}
                />
              </LeadBlock>
            </Section>
          </div>
        </Tabs.TabPanel>
      )}
    </StyledSDPTabLeadBlock>
  );
};

export default TabLeadBlock;
