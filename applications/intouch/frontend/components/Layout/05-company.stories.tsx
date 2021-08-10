import React from "react";
import { SmallProfileCard } from "../Cards/SmallProfileCard";
import { CompanyDetails } from "../Pages/Company/Details";
import { FiftyFiftyGrid } from "../CardHolders/FiftyFiftyGrid";
import { ThreeColumnGrid } from "../ThreeColumnGrid";
import { CompanyRegisteredDetails } from "../Pages/Company/RegisteredDetails";
import { EditCompanyButton } from "../Pages/Company/EditCompany/Button";
import { mockCompany } from "../../fixtures/company";
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
          <CompanyDetails
            company={mockCompany}
            actions={
              <EditCompanyButton
                company={mockCompany}
                onCompanyUpdateSuccess={() => {
                  window.alert("success");
                }}
              />
            }
          />
        </div>
        <CompanyRegisteredDetails
          company={mockCompany}
          onCompanyUpdateSuccess={() => {
            window.alert("success");
          }}
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
          company={mockCompany}
          onCompanyUpdateSuccess={() => {
            window.alert("success");
          }}
        />
      </ThreeColumnGrid>
    </div>
  </Layout>
);

CompanyPage.args = {
  title: "Company"
};
