import React from "react";
import Tabs from "@bmi/tabs";
import { Tab, TabProps } from "@material-ui/core";
import Section from "@bmi/section";
import { isEmpty } from "lodash";
import { useSiteContext } from "../../components/Site";
import withGTM from "../../utils/google-tag-manager";
import BimIframe from "../../components/BimIframe";
import { Assets, Feature, SystemBenefits, Classification } from "./types";
import AboutLeadBlock from "./aboutLeadBlock";
import TechnicalSpecificationLeadBlock from "./technicalSpecificationLeadBlock";

type Props = {
  bimIframeUrl?: string;
  longDescription: string;
  guaranteesAndWarranties?: Assets[];
  awardsAndCertificates?: Assets[];
  keyFeatures?: Feature;
  systemBenefits?: SystemBenefits;
  specification?: Assets;
  technicalSpecClassifications?: Classification[];
};

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const TabLeadBlock = ({
  longDescription,
  guaranteesAndWarranties,
  awardsAndCertificates,
  bimIframeUrl,
  keyFeatures,
  systemBenefits,
  specification,
  technicalSpecClassifications
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <Section backgroundColor="white">
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
          heading={getMicroCopy("sdp.leadBlock.about")}
          index="one"
        >
          <AboutLeadBlock
            longDescription={longDescription}
            guaranteesAndWarranties={guaranteesAndWarranties}
            awardsAndCertificates={awardsAndCertificates}
            keyFeatures={keyFeatures}
            systemBenefits={systemBenefits}
            specification={specification}
          />
        </Tabs.TabPanel>
        {technicalSpecClassifications &&
          !isEmpty(technicalSpecClassifications) && (
            <Tabs.TabPanel
              heading={getMicroCopy("sdp.leadBlock.technicalSpecification")}
              index="two"
            >
              <TechnicalSpecificationLeadBlock
                technicalSpecClassifications={technicalSpecClassifications}
              />
            </Tabs.TabPanel>
          )}
        {Boolean(bimIframeUrl) && (
          <Tabs.TabPanel heading={getMicroCopy("sdp.tabs.bim")} index="four">
            <BimIframe url={bimIframeUrl} />
          </Tabs.TabPanel>
        )}
      </Tabs>
    </Section>
  );
};

export default TabLeadBlock;
