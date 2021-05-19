import React from "react";
import { SmallProfileCard } from "../Cards/SmallProfileCard";
import { CompanyHeader } from "../Cards/CompanyHeader";
import { FiftyFiftyGrid } from "../CardHolders/FiftyFiftyGrid";
import { ThreeColumnGrid } from "../ThreeColumnGrid";
import { CompanyRegisteredDetails } from "../Cards/CompanyRegisteredDetails";
import { Layout, LayoutProps } from ".";

export default {
  title: "Pages/Company",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

export const CompanyPage = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ThreeColumnGrid>
        <div style={{ flex: 2, minWidth: "400px" }}>
          <CompanyHeader title="J & J Roofers">woo</CompanyHeader>
        </div>
        <CompanyRegisteredDetails
          registeredName="J & J Roofers Ltd."
          registeredAddress="28 Old Brompton Road"
          companyVatNumber="GB999 9999 73"
          contract="Valid until: 07 May 2022"
        />
      </ThreeColumnGrid>

      <ThreeColumnGrid>
        <div style={{ flex: 2, minWidth: "400px" }}>
          <FiftyFiftyGrid>
            <SmallProfileCard
              name="Mike Harold"
              jobTitle="Company Owner"
              phoneNumber="67 97 90 00"
              emailAddress="kundeservice.no@bmigroup.com"
              avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=5KMjjefsiZ&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <SmallProfileCard
              name="Jack Peterson"
              jobTitle="Company Administrator"
              phoneNumber="67 97 90 00"
              emailAddress="kundeservice.no@bmigroup.com"
            />
            <SmallProfileCard
              name="Jack Peterson"
              jobTitle="Company Administrator"
              phoneNumber="67 97 90 00"
              emailAddress="kundeservice.no@bmigroup.com"
            />
            <SmallProfileCard
              name="Jack Peterson"
              jobTitle="Company Administrator"
              phoneNumber="67 97 90 00"
              emailAddress="kundeservice.no@bmigroup.com"
            />
          </FiftyFiftyGrid>
        </div>
        <CompanyRegisteredDetails
          registeredName="Placeholder"
          registeredAddress="Placeholder"
          companyVatNumber="Placeholder"
          contract="Placeholder"
        />
      </ThreeColumnGrid>
    </div>
  </Layout>
);

CompanyPage.args = {
  title: "Company"
};
