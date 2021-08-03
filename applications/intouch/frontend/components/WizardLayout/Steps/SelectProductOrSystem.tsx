import React from "react";
import { useWizardContext } from "../WizardContext";
import { SelectProducts } from "./SelectProducts";
import { SelectSystem } from "./SelectSystem";

export const SelectProductOrSystem = () => {
  const { data } = useWizardContext();
  return (
    <div>
      {["SYSTEM", "SOLUTION"].includes(data.guaranteeType.coverage) ? (
        <SelectSystem />
      ) : (
        <SelectProducts />
      )}
    </div>
  );
};
