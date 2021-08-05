import React from "react";
import { mockCompany } from "../../../../../fixtures/company";
import { EditCompanyDialog } from ".";

export default {
  title: "Company Page/Edit Company Dialog",
  component: EditCompanyDialog
};

export const Basic = () => (
  <EditCompanyDialog
    company={mockCompany}
    isOpen
    onCloseClick={() => {
      window.alert("closing dialog!");
    }}
  />
);
