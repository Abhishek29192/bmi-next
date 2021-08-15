import React from "react";
import { useWizardContext } from "../WizardContext";
import SelectProducts from "./SelectProducts";
import SelectSystem from "./SelectSystem";

const SelectProductOrSystem = () => {
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

export default SelectProductOrSystem;
