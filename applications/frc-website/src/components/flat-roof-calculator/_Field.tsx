import { Button, Dialog, Grid, Typography } from "@bmi-digital/components";
import HelpIcon from "@bmi-digital/components/icon/QuestionMark";
import classnames from "classnames";
import React, { useState } from "react";

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
    <div className={classnames("field", extraMargin && "field--extra-margin")}>
      <div className="fieldHeader">
        <Typography variant="h5">{label}</Typography>
        {helpContent ? (
          <>
            <Button
              isIconButton
              size="extra-small"
              variant="text"
              className="iconButton"
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
          <Grid lg={9}>
            <Typography variant="body1" className="fieldDescription">
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
