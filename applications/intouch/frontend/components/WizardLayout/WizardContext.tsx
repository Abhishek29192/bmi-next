import React, { useState, createContext } from "react";
import {
  GuaranteeType,
  Product,
  Project,
  System,
  GuaranteeTemplate
} from "@bmi/intouch-api-types";

export type GuaranteeWizardData = {
  guaranteeType: GuaranteeType;
  guaranteeTemplate: GuaranteeTemplate;
  product: Product;
  system: System;
  evidences: File[];
};

type GuaranteeHeader = {
  title: string;
  subTitle: string;
};

type ContextProps = {
  activeStep: number;
  data?: GuaranteeWizardData;
  setData?: (data: GuaranteeWizardData) => Promise<void>;
  header?: GuaranteeHeader;
  gotoNext?: () => void;
  gotoBack?: () => void;
  submit?: () => void;
  isNextStepAvailable: boolean;
  isBackStepAvailable: boolean;
  isLastStep: boolean;
  project?: Project;
};

type ContextWrapperProps = {
  children?: React.ReactNode;
  project: Project;
  onSubmit?: (data: GuaranteeWizardData) => void;
};

export const WizardContext = createContext<ContextProps | null>(null);
export const useWizardContext = () => React.useContext(WizardContext);

const WizardContextWrapper = ({
  project,
  onSubmit,
  children
}: ContextWrapperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentData, setCurrentData] = useState<GuaranteeWizardData>();

  const getGuaranteeType = (): string => {
    return ["SYSTEM", "SOLUTION"].includes(currentData.guaranteeType.coverage)
      ? "system"
      : "product";
  };

  const getHeader = (): GuaranteeHeader => {
    //TODO:Refactor
    switch (currentStep) {
      case 0:
        return {
          title: "Register for a guarantee",
          subTitle: "Select required level of guarantee"
        };
      case 1:
        return {
          title: "Register for a guarantee",
          subTitle:
            "Select the preferrred language for the guarantee documentation"
        };

      case 2:
        return {
          title: `${currentData.guaranteeType.coverage.toLowerCase()} Guarantee`,
          subTitle: `Select the ${getGuaranteeType()} for the guarantee documentation`
        };

      case 3:
        return {
          title: "Receipt details",
          subTitle:
            "Please upload a copy of the receipt for the product(s) you would like to guarantee"
        };

      case 4:
        return {
          title: "Review",
          subTitle:
            "Please review the information that you have provided, before submitting your application."
        };

      default:
        return null;
    }
  };
  const nextStepAvailable = () => {
    //TODO:Refactor
    if (currentStep === 0) {
      return currentData?.guaranteeType ? true : false;
    }
    if (currentStep === 1) {
      return currentData?.guaranteeTemplate ? true : false;
    }
    if (currentStep === 2) {
      return currentData?.product || currentData.system ? true : false;
    }
    return currentStep < 4;
  };
  return (
    <WizardContext.Provider
      value={{
        activeStep: currentStep,
        setData: async (data) => {
          setCurrentData(data);
        },
        data: currentData,
        project: project,
        header: getHeader(),
        gotoNext: () => {
          setCurrentStep(currentStep + 1);
        },
        gotoBack: () => {
          setCurrentStep(currentStep - 1);
        },
        submit: () => {
          onSubmit(currentData);
        },
        isNextStepAvailable: nextStepAvailable(),
        isBackStepAvailable: currentStep > 0,
        isLastStep: currentStep === 4
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export default WizardContextWrapper;
