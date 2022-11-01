/* eslint-disable no-unreachable */
import {
  Button,
  ButtonProps,
  Dialog,
  SignupBlock,
  SignupBlockTheme
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React, { useState } from "react";
import { microCopy } from "../constants/microCopies";
import { isValidEmail } from "../utils/emailUtils";
import withGTM from "../utils/google-tag-manager";
import FormSection, { Data as FormData } from "./FormSection";
import { useSiteContext } from "./Site";
import styles from "./styles/SignupBlock.module.scss";

export type Data = {
  __typename: "ContentfulSignupBlock";
  title: string;
  description: {
    description: string;
  } | null;
  signupLabel: string;
  signupDialogContent: FormData;
};
const IntegratedSignupBlock = ({
  data,
  theme
}: {
  data?: Data;
  theme?: SignupBlockTheme;
}) => {
  if (!data) {
    return null;
  }
  const { getMicroCopy } = useSiteContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { title, description, signupLabel, signupDialogContent } = data;
  const GTMButton = withGTM<ButtonProps>(Button);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [hubSpotForm, setHubSpotForm] = useState<HTMLFormElement | null>(null);
  const [email, setEmail] = useState("");
  const [legalConsentProcessing, setLegalConsentProcessing] = useState(false);
  const [legalConsentSubscription, setLegalConsentSubscription] =
    useState(false);

  const onSuccess = () => {
    setFormSubmitted(true);
  };
  const onFormReady = (_, hsForm: HTMLFormElement) => {
    setEmail(hsForm.querySelector<HTMLInputElement>("input[type=email]").value);
    hsForm.querySelector<HTMLInputElement>("input[type=email]").oninput = (
      e
    ) => {
      setEmail((e.target as HTMLInputElement).value);
    };

    hsForm.querySelector<HTMLInputElement>(
      "input[id^='LEGAL_CONSENT.subscription']"
    ).onchange = (e) => {
      setLegalConsentSubscription((e.target as HTMLInputElement).checked);
    };

    hsForm.querySelector<HTMLInputElement>(
      "input[id^='LEGAL_CONSENT.processing']"
    ).onchange = (e) => {
      setLegalConsentProcessing((e.target as HTMLInputElement).checked);
    };

    setHubSpotForm(hsForm);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setLegalConsentSubscription(false);
    setLegalConsentProcessing(false);
    setFormSubmitted(false);
  };

  return (
    <div className={styles["SignupBlock"]}>
      <SignupBlock
        title={title}
        description={description?.description}
        inputCallToAction={signupLabel}
        theme={theme || "blue800"}
        buttonComponent={(props: ButtonProps) => (
          <GTMButton
            gtm={{
              id: "cta-click-sign-up",
              label: `${title} - ${signupLabel}`,
              action: "sign up started"
            }}
            {...props}
          />
        )}
        onSubmit={() => {
          setDialogOpen(true);
        }}
      />
      {dialogOpen && (
        <Dialog open={dialogOpen} onCloseClick={handleDialogClose}>
          <Dialog.Title hasUnderline> {title} </Dialog.Title>
          <FormSection
            data={signupDialogContent}
            backgroundColor="white"
            isDialog
            onSuccess={onSuccess}
            onFormReady={onFormReady}
          />

          <Dialog.Actions
            cancelLabel={
              !formSubmitted
                ? getMicroCopy(microCopy.DIALOG_CANCEL)
                : getMicroCopy(microCopy.DIALOG_CLOSE)
            }
            onCancelClick={handleDialogClose}
            confirmLabel={!formSubmitted && signupLabel}
            isConfirmButtonDisabled={
              !(
                isValidEmail(email) &&
                legalConsentSubscription &&
                legalConsentProcessing
              )
            }
            onConfirmClick={!formSubmitted && (() => hubSpotForm.submit())}
          />
        </Dialog>
      )}
    </div>
  );
};

export default IntegratedSignupBlock;

export const query = graphql`
  fragment SignupBlockFragment on ContentfulSignupBlock {
    title
    description {
      description
    }
    signupLabel
    signupDialogContent {
      ...FormSectionFragment
    }
  }
`;
