import React from "react";
import { useTranslation } from "next-i18next";
import { Button, Dialog } from "@bmi/components";
import { Document } from "@contentful/rich-text-types";
import { RichText } from "../../RichText";

export type RequirementDialogProps = {
  isOpen: boolean;
  description: Document;
  onCloseClick: () => void;
  onUploadButtonClick: () => void;
  canUploadAction: boolean;
};

const RequirementDialog = ({
  isOpen,
  description,
  onCloseClick,
  onUploadButtonClick,
  canUploadAction
}: RequirementDialogProps) => {
  const { t } = useTranslation("project-page");

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("upload_tab.requirementModal.title")}
      </Dialog.Title>
      <Dialog.Content data-testid="requirement-modal-content">
        <RichText content={description} />
        {canUploadAction && (
          <Button variant="outlined" onClick={onUploadButtonClick}>
            {t("upload_tab.header")}
          </Button>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

export default RequirementDialog;
