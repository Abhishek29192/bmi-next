/* eslint-disable no-unreachable */
import React, { useState, useCallback } from "react";
import { graphql } from "gatsby";
import { InputBanner } from "@bmi-digital/components";
import { Dialog } from "@bmi-digital/components";
import { Form, FormContext } from "@bmi-digital/components";
import { Button, ButtonProps } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ErrorIcon from "@material-ui/icons/WarningOutlined";
import { devLog } from "../utils/devLog";
import withGTM from "../utils/google-tag-manager";
import { microCopy } from "../constants/microCopies";
import { useSiteContext } from "./Site";
import FormSection, { InputType as FormInputsData } from "./FormSection";
import RichText, { RichTextData } from "./RichText";
import RecaptchaPrivacyLinks from "./RecaptchaPrivacyLinks";

import styles from "./styles/InputBanner.module.scss";

export type Data = {
  title: string;
  description: {
    description: string;
  };
  inputLabel: string;
  submitButtonLabel: string;
  additionalInputs: FormInputsData[];
  confirmationButtonLabel: string | null;
  thankYouMessage: string;
  allowRetry: string | null;
  errorTitle: string | null;
  errorBody: RichTextData | null;
  retryButtonLabel: string | null;
};

const IntegratedInputBanner = ({ data }: { data?: Data }) => {
  const [email, setEmail] = useState("");
  const [additionalFields, setAdditionalFields] = useState(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false);
  const [retryDialogOpen, setRetryDialogOpen] = useState(false);
  const { getMicroCopy } = useSiteContext();
  const {
    title,
    description,
    inputLabel,
    submitButtonLabel,
    additionalInputs,
    thankYouMessage,
    confirmationButtonLabel,
    allowRetry,
    errorTitle,
    errorBody,
    retryButtonLabel
  } = data;

  const canRetry = allowRetry === "Yes";

  const handleSubmit = useCallback(
    async (values) => {
      // integrate with Apsis API using GCP function
      if (!process.env.GATSBY_GCP_APSIS_ENDPOINT) {
        devLog("APSIS API Endpoint is not configured.");
        return;
      }

      const token = await executeRecaptcha();

      try {
        const source = axios.CancelToken.source();
        await axios.post(
          process.env.GATSBY_GCP_APSIS_ENDPOINT,
          {
            email,
            ...values
          },
          {
            cancelToken: source.token,
            headers: { "X-Recaptcha-Token": token }
          }
        );
        setSecondDialogOpen(true);
      } catch (error) {
        devLog(error);
        /* do not show anything for retry */
        /* If retry title in the inputBanner content is not populated on contentful CMS! */
        if (errorTitle && errorBody) {
          setAdditionalFields(values);
          setRetryDialogOpen(true);
        }
      }
      setDialogOpen(false);
    },
    [email, errorTitle, errorBody]
  );

  if (!data) {
    return null;
  }

  const GTMButton = withGTM<ButtonProps>(Button);

  return (
    <div className={styles["InputBanner"]}>
      <InputBanner
        title={title}
        description={description.description}
        inputLabel={inputLabel}
        inputCallToAction={submitButtonLabel}
        inputGroupSuffix={<RecaptchaPrivacyLinks />}
        buttonComponent={(props: ButtonProps) => (
          <GTMButton
            gtm={{
              id: "cta-click1",
              label: submitButtonLabel,
              action: "Opens dialog"
            }}
            {...props}
          />
        )}
        onSubmit={(email) => {
          setEmail(email);

          if (additionalInputs) {
            setDialogOpen(true);

            return;
          }

          setSecondDialogOpen(true);
        }}
      />
      {additionalInputs && (
        <Dialog open={dialogOpen} onCloseClick={() => setDialogOpen(false)}>
          <Dialog.Title hasUnderline>{title}</Dialog.Title>
          <Form>
            <Dialog.Content>
              <FormSection.Inputs inputs={additionalInputs} />
            </Dialog.Content>

            <FormContext.Consumer>
              {({ values, submitButtonDisabled }) => {
                return (
                  <Dialog.Actions
                    cancelLabel={getMicroCopy(microCopy.DIALOG_CANCEL)}
                    onCancelClick={() => setDialogOpen(false)}
                    confirmLabel={
                      confirmationButtonLabel ||
                      getMicroCopy(microCopy.DIALOG_CONFIRM)
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
        open={retryDialogOpen}
        onCloseClick={() => {
          setRetryDialogOpen(false);
        }}
      >
        <Dialog.Title>
          {/* have to keep style for Title component here for simplicity */}
          {/* to allow styled children, we will have to change Dialog control and its style overrides */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <ErrorIcon
              color="error"
              fontSize={"small"}
              style={{ marginRight: "8px" }}
            />
            <Typography variant={"h6"} component="span">
              {errorTitle}
            </Typography>
          </div>
        </Dialog.Title>
        <Dialog.Content>
          {errorBody ? <RichText document={errorBody} /> : null}
        </Dialog.Content>

        <Dialog.Actions
          cancelLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
          onCancelClick={() => {
            setRetryDialogOpen(false);
          }}
          confirmLabel={
            canRetry
              ? retryButtonLabel || getMicroCopy(microCopy.DIALOG_RETRY)
              : null
          }
          onConfirmClick={() => {
            if (canRetry) {
              setRetryDialogOpen(false);
              handleSubmit(additionalFields);
            }
          }}
        />
      </Dialog>

      <Dialog
        open={secondDialogOpen}
        onCloseClick={() => setSecondDialogOpen(false)}
      >
        <Dialog.Title hasUnderline>
          {getMicroCopy(microCopy.CONFIRMATION_MESSAGE_TITLE)}
        </Dialog.Title>
        <Dialog.Content>
          {thankYouMessage || getMicroCopy(microCopy.CONFIRMATION_MESSAGE_BODY)}
        </Dialog.Content>
        <Dialog.Actions
          confirmLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
          onConfirmClick={() => {
            setSecondDialogOpen(false);
          }}
        />
      </Dialog>
    </div>
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
    allowRetry
    errorTitle
    errorBody {
      ...RichTextFragment
    }
    retryButtonLabel
  }
`;
