import { GuaranteeType, Product } from "@bmi/intouch-api-types";
import React, { useState, createContext, useEffect } from "react";

type GuaranteeWizardData = {
  guaranteeType: GuaranteeType;
  guaranteeTemplateId: string;
  product: Product;
};

type ContextProps = {
  activeStep: number;
  data?: GuaranteeWizardData;
  setData?: (data: GuaranteeWizardData) => Promise<void>;
  title?: string;
  subTitle?: string;
  gotoNext?: () => void;
  gotoBack?: () => void;
  isNextStepAvailable: boolean;
  isBackStepAvailable: boolean;
};

type ContextWrapperProps = {
  children?: React.ReactNode;
  step: number;
};

export const WizardContext = createContext<ContextProps | null>(null);
export const useWizardContext = () => React.useContext(WizardContext);

const WizardContextWrapper = ({ step, children }: ContextWrapperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(step);
  const [currentData, setCurrentData] = useState<GuaranteeWizardData>();
  const title = "Register for a guarantee";

  const getSubTitle = () => {
    //TODO:Refactor
    switch (currentStep) {
      case 0:
        return "Select required level of guarantee";
      case 1:
        return "Select the preferrred language for the guarantee documentation";
      case 2:
        return "Select the product for the guarantee documentation";
      default:
        return "";
    }
  };

  const nextStepAvailable = () => {
    //TODO:Refactor
    if (currentStep === 0) {
      return currentData?.guaranteeType ? true : false;
    }
    if (currentStep === 1) {
      return currentData?.guaranteeTemplateId ? true : false;
    }
    if (currentStep === 2) {
      return currentData?.product ? true : false;
    }
    return currentStep < 5;
  };

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  return (
    <WizardContext.Provider
      value={{
        activeStep: currentStep,
        setData: async (data) => {
          setCurrentData(data);
        },
        data: currentData,
        title,
        subTitle: getSubTitle(),
        gotoNext: () => {
          setCurrentStep(currentStep + 1);
        },
        gotoBack: () => {
          setCurrentStep(currentStep - 1);
        },
        isNextStepAvailable: nextStepAvailable(),
        isBackStepAvailable: currentStep > 0
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export default WizardContextWrapper;
