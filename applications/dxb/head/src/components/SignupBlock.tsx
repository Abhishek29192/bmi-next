/* eslint-disable no-unreachable */
import React, { useState } from "react";
import { graphql } from "gatsby";
import { SignupBlock } from "@bmi/components";
import { Dialog } from "@bmi/components";
import { Button, ButtonProps } from "@bmi/components";
import { SignupBlockTheme } from "@bmi/components/src/signup-block/SignupBlock";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import FormSection, { Data as FormData } from "./FormSection";

import styles from "./styles/SignupBlock.module.scss";
import { useSiteContext } from "./Site";

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
      {
        //todo use dialog action buttons instead of forms submit button
      }
      {dialogOpen && (
        <Dialog open={dialogOpen} onCloseClick={() => setDialogOpen(false)}>
          <Dialog.Title hasUnderline> {title} </Dialog.Title>
          <FormSection data={signupDialogContent} backgroundColor="white" />

          <Dialog.Actions
            cancelLabel={getMicroCopy(microCopy.DIALOG_CANCEL)}
            onCancelClick={() => setDialogOpen(false)}
            confirmLabel={signupLabel}
            onConfirmClick={() => {
              setDialogOpen(false);
            }}
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
