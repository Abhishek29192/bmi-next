import React from "react";
import { Icon } from "@bmi-digital/components";
import { BMI } from "@bmi-digital/components";
import { Button } from "@bmi-digital/components";
import CloseIcon from "@material-ui/icons/Close";
import Link from "next/link";
import { GetProjectQuery } from "../../graphql/generated/operations";
import WizardContextWrapper, { GuaranteeWizardData } from "./WizardContext";
import styles from "./styles.module.scss";
import { WizardBody } from "./WizardBody";
import { WizardFooter } from "./WizardFooter";

export type WizardProps = {
  children: React.ReactNode | React.ReactNode[];
  project: GetProjectQuery["project"];
  onCloseClick?: () => void;
  onSubmitClick?: (data: GuaranteeWizardData) => void;
  isSubmit?: boolean;
};

export const Wizard = ({
  children,
  project,
  onCloseClick,
  onSubmitClick,
  isSubmit
}: WizardProps) => {
  return (
    <WizardContextWrapper
      project={project}
      onSubmit={onSubmitClick}
      isSubmit={isSubmit}
    >
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.header__inner}>
            <Link href="/">
              <Icon source={BMI} className={styles.logo} />
            </Link>

            <Button variant="text" isIconButton onClick={onCloseClick}>
              <CloseIcon color="primary" />
            </Button>
          </div>
        </div>
        <WizardBody>{children}</WizardBody>
        <WizardFooter />
      </div>
    </WizardContextWrapper>
  );
};
