import React from "react";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import Button from "@bmi/button";
import { Project } from "@bmi/intouch-api-types";
import CloseIcon from "@material-ui/icons/Close";
import Link from "next/link";
import WizardContextWrapper, { GuaranteeWizardData } from "./WizardContext";
import styles from "./styles.module.scss";
import { WizardBody } from "./WizardBody";
import { WizardFooter } from "./WizardFooter";

export type WizardProps = {
  children: React.ReactNode | React.ReactNode[];
  project: Project;
  onCloseClick?: () => void;
  onSubmitClick?: (data: GuaranteeWizardData) => void;
};

export const Wizard = ({
  children,
  project,
  onCloseClick,
  onSubmitClick
}: WizardProps) => {
  return (
    <WizardContextWrapper project={project} onSubmit={onSubmitClick}>
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
