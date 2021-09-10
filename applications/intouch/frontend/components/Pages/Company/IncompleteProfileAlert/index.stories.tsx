import React from "react";
import { IncompleteProfileAlert } from ".";

export default {
  title: "Company Page / Incomplete Profile Alert",
  component: IncompleteProfileAlert
};

export const SingleMissingField = () => (
  <IncompleteProfileAlert missingFields={["phone"]} />
);

export const MultipleMissingFields = () => (
  <IncompleteProfileAlert
    missingFields={["phone", "aboutUs", "tradingAddress"]}
  />
);
