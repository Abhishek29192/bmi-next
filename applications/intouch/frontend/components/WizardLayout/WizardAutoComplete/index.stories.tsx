import React from "react";
import { WizardAutoComplete, WizardAutoCompleteOptions } from ".";

const autoCompleteOptions: WizardAutoCompleteOptions = {
  totalCount: 12,
  items: [
    {
      id: 1,
      name: "Product1",
      description: "Details1"
    },
    {
      id: 2,
      name: "Product2",
      description: "Details2"
    },
    {
      id: 3,
      name: "Product3",
      description: "Details3"
    },
    {
      id: 4,
      name: "Product4",
      description: "Details4"
    },
    {
      id: 5,
      name: "Product5",
      description: "Details5"
    },
    {
      id: 6,
      name: "Product6",
      description: "Details6"
    },
    {
      id: 7,
      name: "Product7",
      description: "Details7"
    }
  ]
};
export default {
  title: "Wizard Auto Complete",
  component: WizardAutoComplete
};

export const Basic = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh"
    }}
  >
    <div style={{ width: "560px" }}>
      <WizardAutoComplete options={autoCompleteOptions} />
    </div>
  </div>
);
