import React from "react";
import { CompanyIncompleteProfileAlert } from ".";

export default {
  title: "CompanyIncompleteProfileAlert",
  component: CompanyIncompleteProfileAlert
};

export const SingleMissingField = () => (
  <CompanyIncompleteProfileAlert missingFields={["phone"]} />
);

export const MultipleMissingFields = () => (
  <CompanyIncompleteProfileAlert
    missingFields={["phone", "aboutUs", "tradingAddress"]}
  />
);
