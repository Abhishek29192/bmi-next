/* eslint-disable no-unreachable */
import React, { useState, useCallback } from "react";
import { graphql } from "gatsby";
import InputBanner from "@bmi/input-banner";
import Dialog from "@bmi/dialog";
import Form, { FormContext } from "@bmi/form";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ErrorIcon from "@material-ui/icons/WarningOutlined";
import Button, { ButtonProps } from "@bmi/button";
import Typography from "@bmi/typography";
import { devLog } from "../utils/devLog";
import withGTM from "../utils/google-tag-manager";
import { useSiteContext } from "./Site";
import FormInputs, { Data as FormInputsData } from "./FormInputs";
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
  additionalInputs: FormInputsData;
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
          cancelLabel={getMicroCopy("dialog.close")}
          onCancelClick={() => {
            setRetryDialogOpen(false);
          }}
          confirmLabel={
            canRetry ? retryButtonLabel || getMicroCopy("dialog.retry") : null
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
