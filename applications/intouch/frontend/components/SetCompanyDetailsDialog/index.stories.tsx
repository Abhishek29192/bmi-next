import React from "react";
import { mockCompany } from "../../fixtures/company";
import { SetCompanyDetailsDialog } from ".";

export default {
  title: "Company Page/Set Company Details",
  component: SetCompanyDetailsDialog
};

export const Basic = () => (
  <SetCompanyDetailsDialog
    title="Set Company Details Story"
    company={mockCompany}
    isOpen
    onCloseClick={() => {
      window.alert("closing dialog!");
    }}
    onSubmit={(values) => {
      window.alert(`submitting values! ${JSON.stringify(values, null, 2)}`);
    }}
  />
);
