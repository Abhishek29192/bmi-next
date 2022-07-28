import React from "react";
import { useTranslation } from "next-i18next";
import { Checkbox, Dialog, Grid } from "@bmi/components";
import AccessControl from "../../../lib/permissions/AccessControl";
import styles from "../../Pages/Project/CreateProject/styles.module.scss";
import { getFieldLabel } from "../../Pages/Project/Form";

export type DialogProps = {
  title: string;
  description: string;
  open: boolean;
  onConfirm: () => void;
  inspectionFlag?: boolean;
};

type Props = {
  dialogState: DialogProps;
  onCancel: () => void;
  setInspectionState?: (val: boolean) => void;
  inspection?: boolean;
};

const ConfirmDialog = ({
  dialogState,
  onCancel,
  setInspectionState,
  inspection
}: Props) => {
  const { t } = useTranslation("project-page");

  const updateInspection = (value) => {
    setInspectionState(value);
  };

  return (
    <Dialog
      onCloseClick={onCancel}
      open={dialogState.open}
      data-testid="project-details-dialog"
    >
      <Dialog.Title hasUnderline>{t(dialogState.title)}</Dialog.Title>
      <Dialog.Content>{t(dialogState.description)}</Dialog.Content>
      <Grid container>
        <Grid item sm={6}>
          {dialogState.inspectionFlag && (
            <AccessControl dataModel="project" action="inspection">
              <div className={styles.inspectionWrapper}>
                <Checkbox
                  name={"inspection"}
                  label={getFieldLabel(t, "inspection")}
                  checked={inspection}
                  className={styles.inspectionCheckbox}
                  onChange={(value) => updateInspection(value)}
                />
              </div>
            </AccessControl>
          )}
        </Grid>
        <Grid item sm={6}>
          <Dialog.Actions
            confirmLabel={t("projectActions.cta.confirm")}
            onConfirmClick={dialogState.onConfirm}
            cancelLabel={t("projectActions.cta.cancel")}
            onCancelClick={onCancel}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default ConfirmDialog;
