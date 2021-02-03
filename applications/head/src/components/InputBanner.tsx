/* eslint-disable no-unreachable */
import React, { useState, useCallback, useContext } from "react";
import { graphql } from "gatsby";
import InputBanner from "@bmi/input-banner";
import Dialog from "@bmi/dialog";
import Form, { FormContext } from "@bmi/form";
import { SiteContext } from "./Site";
import FormInputs, { Data as FormInputsData } from "./FormInputs";

export type Data = {
  title: string;
  description: {
    description: string;
  };
  inputLabel: string;
  submitButtonLabel: string;
  additionalInputs: FormInputsData;
  confirmationButtonLabel: string | null;
  thankYouMessage: string;
};

const IntegratedInputBanner = ({ data }: { data?: Data }) => {
  if (!data) {
    return null;
  }

  const [email, setEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const { getMicroCopy } = useContext(SiteContext);

  const {
    title,
    description,
    inputLabel,
    submitButtonLabel,
    additionalInputs,
    thankYouMessage,
    confirmationButtonLabel
  } = data;

  const handleSubmit = useCallback(
    (additionalFields) => {
      // TODO: Integrate with the service Norway wants.
      // I have no idea on how different markets will implement this. But it's 03:40
      // and I'm not willing to figure that out now.

      // eslint-disable-next-line no-console
      console.log({ email, ...additionalFields });
      setDialogOpen(false);
      setSecondDialogOpen(true);
    },
    [email]
  );

  return (
    <>
      {additionalInputs && (
        <Dialog open={dialogOpen} onCloseClick={() => setDialogOpen(false)}>
          <Dialog.Title hasUnderline>{title}</Dialog.Title>
          <Form>
            <Dialog.Content>
              <FormInputs data={additionalInputs} />
            </Dialog.Content>

            <FormContext.Consumer>
              {({ values, submitButtonDisabled }) => {
                return (
                  <Dialog.Actions
                    cancelLabel={getMicroCopy("dialog.cancel")}
                    onCancelClick={() => setDialogOpen(false)}
                    confirmLabel={
                      confirmationButtonLabel || getMicroCopy("dialog.confirm")
                    }
                    isConfirmButtonDisabled={submitButtonDisabled}
                    onConfirmClick={() => {
                      handleSubmit(values);
                    }}
                  />
                );
              }}
            </FormContext.Consumer>
          </Form>
        </Dialog>
      )}
      <Dialog
        open={secondDialogOpen}
        onCloseClick={() => setSecondDialogOpen(false)}
      >
        <Dialog.Title hasUnderline>
          {getMicroCopy("confirmationMessage.title")}
        </Dialog.Title>
        <Dialog.Content>
          {thankYouMessage || getMicroCopy("confirmationMessage.body")}
        </Dialog.Content>
        <Dialog.Actions
          confirmLabel={getMicroCopy("dialog.close")}
          onConfirmClick={() => {
            setSecondDialogOpen(false);
          }}
        />
      </Dialog>
      <InputBanner
        title={title}
        description={description.description}
        inputLabel={inputLabel}
        inputCallToAction={submitButtonLabel}
        onSubmit={(email) => {
          setEmail(email);

          if (additionalInputs) {
            setDialogOpen(true);

            return;
          }

          setSecondDialogOpen(true);
        }}
      />
    </>
  );
};

export default IntegratedInputBanner;

export const query = graphql`
  fragment InputBannerFragment on ContentfulInputBanner {
    title
    description {
      description
    }
    inputLabel
    submitButtonLabel
    additionalInputs {
      ...FormInputsFragment
    }
    confirmationButtonLabel
    thankYouMessage
  }
`;
