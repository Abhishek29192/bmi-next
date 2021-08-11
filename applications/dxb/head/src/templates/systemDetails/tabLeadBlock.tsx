import React, { useContext } from "react";
import Tabs from "@bmi/tabs";
import { Tab, TabProps } from "@material-ui/core";
import { SiteContext } from "../../components/Site";
import withGTM from "../../utils/google-tag-manager";
import { SystemDetails } from "./types";
import AboutLeadBlock from "./aboutLeadBlock";

type Props = {
  data: SystemDetails;
};

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

const TabLeadBlock = ({ data: { longDescription, assets } }: Props) => {
  const { getMicroCopy } = useContext(SiteContext);

  return (
    <Tabs
      initialValue="one"
      tabComponent={(props: TabProps) => (
        <GTMTab
          gtm={{ id: "selector-tabs1", action: "Selector – Tabs" }}
          {...props}
        />
      )}
    >
      <Tabs.TabPanel heading={getMicroCopy("sdp.leadBlock.about")} index="one">
        <AboutLeadBlock
          longDescription={longDescription}
          guaranteesAndWarranties={assets.filter(
            ({ assetType }) =>
              assetType === "GUARANTIES" || assetType === "WARRANTIES"
          )}
          awardsAndCertificates={assets.filter(
            ({ assetType }) =>
              assetType === "AWARDS" || assetType === "CERTIFICATES"
          )}
        />
      </Tabs.TabPanel>
    </Tabs>
  );
};

export default TabLeadBlock;
