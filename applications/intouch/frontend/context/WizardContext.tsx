import { GuaranteeType, Product } from "@bmi/intouch-api-types";
import React, { useState, createContext, useEffect } from "react";

type GuaranteeWizardData = {
  guaranteeType: GuaranteeType;
  product: Product;
};

type ContextProps = {
  activeStep: number;
  setStep?: (step: number) => Promise<void>;
  data?: GuaranteeWizardData;
  setData?: (data: GuaranteeWizardData) => Promise<void>;
  title?: string;
  subTitle?: string;
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
    switch (currentStep) {
      case 0:
        return "Select required level of guarantee";
      case 1:
        return "Select the preferrred language for the guarantee documentation";
      default:
        return "";
    }
  };

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  return (
    <WizardContext.Provider
      value={{
        activeStep: currentStep,
        setStep: async (step) => {
          setCurrentStep(step);
        },
        setData: async (data) => {
          setCurrentData(data);
        },
        data: currentData,
        title,
        subTitle: getSubTitle()
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export default WizardContextWrapper;
