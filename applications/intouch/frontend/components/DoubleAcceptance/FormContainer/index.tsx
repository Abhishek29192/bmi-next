import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Checkbox, Dialog, Grid, Form, TextField } from "@bmi/components";
import { Typography } from "@bmi/components";
import { Document } from "@contentful/rich-text-types";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import log from "../../../lib/logger";
import styles from "../styles.module.scss";
import { Props as DoubleAcceptanceProps } from "../../../pages/double-acceptance/[tempToken]";
import { RichText } from "../../../components/RichText";
import {
  updateDoubleAcceptance,
  releaseGuaranteePdf
} from "../../../lib/doubleAcceptance";

type Props = {
  doubleAcceptance: DoubleAcceptanceProps["doubleAcceptance"];
  onUpdateDoubleAcceptanceCompleted: (
    doubleAcceptance: DoubleAcceptanceProps["doubleAcceptance"]
  ) => void;
  customApolloClient: ApolloClient<NormalizedCacheObject>;
};

const FormContainer = ({
  doubleAcceptance,
  onUpdateDoubleAcceptanceCompleted,
  customApolloClient
}: Props) => {
  const { t } = useTranslation(["double-acceptance", "common"]);
  const [formData, setFormData] = useState({
    acknowledge: false,
    firstName: null,
    lastName: null
  });
  const [acceptance, setAcceptance] = useState(false);
  const [showDialog, setShowDialog] = useState({ open: false, title: "" });
  const handleSubmit = useCallback(
    async (event, { firstName, lastName }) => {
      event.preventDefault();

      try {
        const { data } = await customApolloClient.mutate({
          mutation: updateDoubleAcceptance,
          variables: {
            input: {
              id: doubleAcceptance.id,
              patch: {
                signature: `${firstName} ${lastName}`,
                acceptance,
                acceptanceDate: new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")
              }
            }
          }
        });
        if (data) {
          if (acceptance) {
            await customApolloClient.mutate({
              mutation: releaseGuaranteePdf,
              variables: {
                input: {
                  id: doubleAcceptance.guaranteeId,
                  template: {
                    mailBody: doubleAcceptance.guaranteeTemplate.mailBody,
                    mailSubject: doubleAcceptance.guaranteeTemplate.mailSubject
                  }
                }
              }
            });
          }
          onUpdateDoubleAcceptanceCompleted({
            ...doubleAcceptance,
            completed: true
          });
        }
      } catch (error) {
        log({
          severity: "ERROR",
          message: `There was an error updating the double Acceptance: ${error.toString()}`
        });
      }
    },
    [doubleAcceptance, updateDoubleAcceptance, customApolloClient, acceptance]
  );
  const onItemChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    },
    [setFormData]
  );
  const enableSubmitButton = useMemo(() => {
    return Object.values(formData).every((val) => !!val);
  }, [formData]);

  return (
    <div className={styles.container}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" hasUnderline>
            {t("title")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div>
            {(
              t("description", {
                returnObjects: true
              }) as string[]
            ).map((description, id) => (
              <div key={`description-${id}`}>{description}</div>
            ))}
          </div>
        </Grid>
      </Grid>
      <div className={styles.body}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" className={styles.subtitle}>
              {t("warrantyPeriod")}
            </Typography>
            <div>{`${doubleAcceptance.maximumValidityYears} ${t(
              "years"
            )}`}</div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" className={styles.subtitle}>
              {t("guaranteeScope")}
            </Typography>
            <div>{doubleAcceptance.guaranteeTemplate.guaranteeScope}</div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" className={styles.subtitle}>
              {t("guaranteeConditions")}
            </Typography>
            <div>{t("guaranteeConditionsDescription")}</div>
            <div>
              {doubleAcceptance.guaranteeTemplate.onerousConditionsSummary}
            </div>
            <div className={styles.guaranteeConditionsText}>
              <div>
                <RichText
                  content={
                    doubleAcceptance.guaranteeTemplate.onerousConditionsText
                      ?.json
                  }
                  links={
                    doubleAcceptance.guaranteeTemplate.onerousConditionsText
                      ?.links as unknown as Document
                  }
                />
              </div>
            </div>
          </Grid>
        </Grid>
        <Form
          id="double-acceptance-form"
          onSubmit={handleSubmit}
          rightAlignButton
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          data-testid="double-acceptance-form"
        >
          <Grid container>
            <Grid item xs={12}>
              <Checkbox
                name={"acknowledge"}
                label={t("form.fields.acceptance.label")}
                checked={formData.acknowledge}
                onChange={(value) => onItemChange("acknowledge", value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={6}>
                  <TextField
                    name="firstName"
                    label={t("form.fields.firstname.label")}
                    fieldIsRequiredError={t("common:error_messages.required")}
                    onChange={(value) => onItemChange("firstName", value)}
                    fullWidth
                    isRequired
                    disabled={!formData.acknowledge}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="lastName"
                    label={t("form.fields.lastname.label")}
                    fieldIsRequiredError={t("common:error_messages.required")}
                    onChange={(value) => onItemChange("lastName", value)}
                    fullWidth
                    isRequired
                    disabled={!formData.acknowledge}
                  />
                </Grid>
              </Grid>
            </Grid>
            {enableSubmitButton && (
              <React.Fragment>
                <Grid item xs={12}>
                  <Typography variant="h4" className={styles.subtitle}>
                    {t("acceptanceTitle")}
                  </Typography>
                  <div>
                    {(
                      t("acceptanceDescription", {
                        returnObjects: true
                      }) as string[]
                    ).map((description, id) => (
                      <div key={`acceptance-description-${id}`}>
                        {description}
                      </div>
                    ))}
                  </div>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Form.ButtonWrapper>
                    <Form.Button
                      variant="outlined"
                      onClick={() => {
                        setAcceptance(false);
                        setShowDialog({
                          open: true,
                          title: t("dialog.title", {
                            acceptance: t("reject").toLowerCase()
                          })
                        });
                      }}
                    >
                      {t("reject")}
                    </Form.Button>
                    <Form.Button
                      onClick={() => {
                        setAcceptance(true);
                        setShowDialog({
                          open: true,
                          title: t("dialog.title", {
                            acceptance: t("accept").toLowerCase()
                          })
                        });
                      }}
                    >
                      {t("accept")}
                    </Form.Button>
                  </Form.ButtonWrapper>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </Form>
      </div>
      <Dialog
        open={showDialog.open}
        onCloseClick={() => setShowDialog({ ...showDialog, open: false })}
      >
        <Dialog.Title hasUnderline>{showDialog.title}</Dialog.Title>
        <Dialog.Content>{t("dialog.description")}</Dialog.Content>
        <Dialog.Content>
          <Form rightAlignButton>
            <Form.ButtonWrapper>
              <Form.Button
                variant="outlined"
                onClick={() => setShowDialog({ ...showDialog, open: false })}
              >
                {t("dialog.cta.back")}
              </Form.Button>
              <Form.SubmitButton
                type="submit"
                form="double-acceptance-form"
                data-testid="double-acceptance-dialog-submit"
              >
                {t("dialog.cta.confirm")}
              </Form.SubmitButton>
            </Form.ButtonWrapper>
          </Form>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default FormContainer;
