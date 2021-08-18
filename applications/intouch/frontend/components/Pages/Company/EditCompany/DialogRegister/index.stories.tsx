import React from "react";
import { RegisterCompanyDialog } from ".";

export default {
  title: "Profile Page/Register Company Dialog",
  component: RegisterCompanyDialog
};

export const Basic = () => (
  <RegisterCompanyDialog
    isOpen
    onCloseClick={() => {
      window.alert("closing dialog!");
    }}
  />
);
