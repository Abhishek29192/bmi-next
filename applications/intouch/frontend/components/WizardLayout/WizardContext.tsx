import React, { useState, createContext } from "react";
import { Product, System, GuaranteeType } from "@bmi/intouch-api-types";
import {
  GetGuaranteeTemplatesQuery,
  GetProjectQuery
} from "../../graphql/generated/operations";

export type GuaranteeWizardData = {
  guaranteeType: GuaranteeType;
  guaranteeTemplate: GetGuaranteeTemplatesQuery["guaranteeTemplateCollection"]["items"][0];
  product: Product;
  system: System;
  evidences: File[];
};

type GuaranteeHeader = {
  title: string;
  subTitle: string;
};

export type ContextProps = {
  activeStep: number;
  previousStep: number;
  data?: GuaranteeWizardData;
  setData?: (data: GuaranteeWizardData) => Promise<void>;
  header: GuaranteeHeader;
  gotoNext?: () => void;
  gotoBack?: () => void;
  submit?: () => void;
  isNextStepAvailable: boolean;
  isBackStepAvailable: boolean;
  isLastStep: boolean;
  project?: GetProjectQuery["project"];
  isSubmit?: boolean;
};

export type ContextWrapperProps = {
  children?: React.ReactNode;
  project: GetProjectQuery["project"];
  onSubmit?: (data: GuaranteeWizardData) => void;
  isSubmit?: boolean;
};

export const WizardContext = createContext<ContextProps | null>(null);
export const useWizardContext = () => React.useContext(WizardContext);

const WizardContextWrapper = ({
  project,
  onSubmit,
  isSubmit,
  children
}: ContextWrapperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentData, setCurrentData] = useState<GuaranteeWizardData>();
  const [previousStep, setPreviousStep] = useState<number>(0);

  const getTitle = () => {
    const type = currentData?.guaranteeType?.coverage.toLowerCase();

    return {
      title: `guarantee_tab.apply_guarantee.wizard.step3.${type}_title`,
      subTitle: `guarantee_tab.apply_guarantee.wizard.step3.${type}_subTitle`
    };
  };

  const getHeader = (): GuaranteeHeader => {
    //TODO:Refactor
    switch (currentStep) {
      case 0:
        return {
          title: "guarantee_tab.apply_guarantee.wizard.step1.title",
          subTitle: "guarantee_tab.apply_guarantee.wizard.step1.subTitle"
        };
      case 1:
        return {
          title: "guarantee_tab.apply_guarantee.wizard.step2.title",
          subTitle: "guarantee_tab.apply_guarantee.wizard.step2.subTitle"
        };
      case 2:
        return getTitle();
      case 3:
        return {
          title: "guarantee_tab.apply_guarantee.wizard.step4.title",
          subTitle: "guarantee_tab.apply_guarantee.wizard.step4.subTitle"
        };
      case 4:
        return {
          title: "guarantee_tab.apply_guarantee.wizard.step5.title",
          subTitle: "guarantee_tab.apply_guarantee.wizard.step5.subTitle"
        };
      default:
        return {
          title: "guarantee_tab.apply_guarantee.wizard.stepDefault.title",
          subTitle: "guarantee_tab.apply_guarantee.wizard.stepDefault.subTitle"
        };
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
    if (currentStep === 3) {
      return currentData?.evidences?.length > 0;
    }
    return currentStep < 4;
  };

  return (
    <WizardContext.Provider
      value={{
        activeStep: currentStep,
        previousStep: previousStep,
        setData: async (data) => {
          setCurrentData(data);
        },
        data: currentData,
        project: project,
        header: getHeader(),
        gotoNext: () => {
          setPreviousStep(currentStep);
          setCurrentStep(currentStep + 1);
        },
        gotoBack: () => {
          setPreviousStep(currentStep);
          setCurrentStep(currentStep - 1);
        },
        submit: () => {
          onSubmit(currentData);
        },
        isNextStepAvailable: nextStepAvailable(),
        isBackStepAvailable: currentStep > 0,
        isLastStep: currentStep === 4,
        isSubmit: isSubmit
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export default WizardContextWrapper;
