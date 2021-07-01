import React, { useState } from "react";
import classnames from "classnames";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Dialog from "@bmi/dialog";
import Grid from "@bmi/grid";
import HelpIcon from "@material-ui/icons/Help";
import styles from "./FlatRoofCalculator.module.scss";

type FieldProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  extraMargin?: boolean;
  helpContent?: React.ReactNode;
  children: React.ReactNode;
};

const Field = ({
  label,
  description,
  helpContent,
  extraMargin,
  children
}: FieldProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div
      className={classnames(styles["field"], {
        [styles["field--extra-margin"]]: extraMargin
      })}
    >
      <div className={styles["fieldHeader"]}>
        <Typography variant="h5">{label}</Typography>
        {helpContent ? (
          <>
            <Button
              isIconButton
              size="extra-small"
              variant="text"
              className={styles["iconButton"]}
              onClick={openDialog}
              tabIndex="-1"
            >
              <HelpIcon />
            </Button>
            <Dialog
              maxWidth={"sm"}
              open={isDialogOpen}
              onCloseClick={closeDialog}
            >
              <Dialog.Title variant={"h5"} hasUnderline>
                {label}
              </Dialog.Title>
              <Dialog.Content>{helpContent}</Dialog.Content>
              <Dialog.Actions
                confirmLabel={"Close"}
                onConfirmClick={closeDialog}
              />
            </Dialog>
          </>
        ) : null}
      </div>
      {description ? (
        <Grid container>
          <Grid item lg={9}>
            <Typography variant="body1" className={styles["fieldDescription"]}>
              {description}
            </Typography>
          </Grid>
        </Grid>
      ) : null}
      {children}
    </div>
  );
};

export default Field;