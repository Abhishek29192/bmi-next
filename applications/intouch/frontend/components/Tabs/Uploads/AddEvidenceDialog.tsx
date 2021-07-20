import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@bmi/dialog";
import Upload, { UploadFile } from "@bmi/upload";

type AddEvidenceDialogProps = {
  isOpen: boolean;
  onCloseClick: () => void;
  onConfirmClick: (files: UploadFile[]) => void;
};
export const AddEvidenceDialog = ({
  isOpen,
  onCloseClick,
  onConfirmClick
}: AddEvidenceDialogProps) => {
  const { t } = useTranslation("project-page");
  const [files, setFiles] = useState([]);

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("uploadTab.add_evidence_modal.title")}
      </Dialog.Title>
      <Dialog.Content>
        <Upload
          id={"add-evidence"}
          name={"add-evidence"}
          buttonLabel={t("uploadTab.add_evidence_modal.button-label")}
          accept=".pdf,.jpg,.jpeg,.png"
          instructions={t("uploadTab.add_evidence_modal.instruction")}
          mapValue={() => {}}
          mapBody={(file) => ({ file })}
          microcopyProvider={{
            "upload.instructions.drop": t(
              "uploadTab.add_evidence_modal.microcopy.drop"
            ),
            "upload.instructions.browse": t(
              "uploadTab.add_evidence_modal.microcopy.browse"
            )
          }}
          defaultExpanded={true}
          onChange={(files) => setFiles(files)}
        />
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("uploadTab.add_evidence_modal.confirm_label")}
        onConfirmClick={() => onConfirmClick(files)}
        isConfirmButtonDisabled={files.length === 0}
        cancelLabel={t("uploadTab.add_evidence_modal.cancel_label")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
