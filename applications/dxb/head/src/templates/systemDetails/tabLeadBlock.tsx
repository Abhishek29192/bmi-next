import React from "react";
import Tabs from "@bmi/tabs";
import { Tab, TabProps } from "@material-ui/core";
import Section from "@bmi/section";
import { useSiteContext } from "../../components/Site";
import withGTM from "../../utils/google-tag-manager";
import BimIframe from "../../components/BimIframe";
import { Assets } from "./types";
import AboutLeadBlock from "./aboutLeadBlock";

type Props = {
  bimIframeUrl?: string;
  longDescription: string;
  guaranteesAndWarranties: Assets[];
  awardsAndCertificates: Assets[];
};

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const TabLeadBlock = ({
  longDescription,
  guaranteesAndWarranties,
  awardsAndCertificates,
  bimIframeUrl
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
          />
        </Tabs.TabPanel>

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
