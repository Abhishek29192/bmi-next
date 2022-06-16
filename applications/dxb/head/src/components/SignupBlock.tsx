/* eslint-disable no-unreachable */
import { Button, ButtonProps, Dialog, SignupBlock } from "@bmi/components";
import { SignupBlockTheme } from "@bmi/components/src/signup-block/SignupBlock";
import { graphql } from "gatsby";
import React, { useState } from "react";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import FormSection, { Data as FormData } from "./FormSection";
import { useSiteContext } from "./Site";
import styles from "./styles/SignupBlock.module.scss";

export type Data = {
  __typename: "ContentfulSignupBlock";
  title: string;
  description: {
    description: string;
  };
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

  const onSuccess = () => setFormSubmitted(true);

  return (
    <div className={styles["SignupBlock"]}>
      <SignupBlock
        title={title}
        description={description.description}
        inputCallToAction={signupLabel}
        theme={theme || "blue-800"}
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
        <Dialog open={dialogOpen} onCloseClick={() => setDialogOpen(false)}>
          <Dialog.Title hasUnderline> {title} </Dialog.Title>
          <FormSection
            data={signupDialogContent}
            backgroundColor="white"
            isDialog
            onSuccess={onSuccess}
          />

          <Dialog.Actions
            cancelLabel={
              !formSubmitted
                ? getMicroCopy(microCopy.DIALOG_CANCEL)
                : getMicroCopy(microCopy.DIALOG_CLOSE)
            }
            onCancelClick={() => {
              setDialogOpen(false);
              setFormSubmitted(false);
            }}
            confirmLabel={!formSubmitted && signupLabel}
            onConfirmClick={
              !formSubmitted &&
              (() =>
                document
                  .querySelector<HTMLFormElement>(
                    "div[id*='bmi-hubspot-form'] form"
                  )
                  .submit())
            }
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
