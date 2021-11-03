import React, { useState, createContext } from "react";
import {
  Product,
  Project,
  System,
  GuaranteeType
} from "@bmi/intouch-api-types";
import { GetGuaranteeTemplatesQuery } from "../../graphql/generated/operations";

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

type ContextProps = {
  activeStep: number;
  data?: GuaranteeWizardData;
  setData?: (data: GuaranteeWizardData) => Promise<void>;
  header: GuaranteeHeader;
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
