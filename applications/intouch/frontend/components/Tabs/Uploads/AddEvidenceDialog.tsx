import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@bmi/dialog";
import Upload from "@bmi/upload";

type AddEvidenceDialogProps = {
  isOpen: boolean;
  onCloseClick: () => void;
  onConfirmClick: (files: File[]) => void;
};
export const AddEvidenceDialog = ({
  isOpen,
  onCloseClick,
  onConfirmClick
}: AddEvidenceDialogProps) => {
  const { t } = useTranslation("project-page");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("upload_tab.add_evidence_modal.title")}
      </Dialog.Title>
      <Dialog.Content>
        <Upload
          id={"add-evidence"}
          name={"add-evidence"}
          buttonLabel={t("upload_tab.add_evidence_modal.button_label")}
          accept=".pdf,.jpg,.jpeg,.png"
          instructions={t("upload_tab.add_evidence_modal.instruction")}
          mapValue={() => {}}
          mapBody={(file) => ({ file })}
          microcopyProvider={{
            "upload.instructions.drop": t(
              "upload_tab.add_evidence_modal.microcopy.drop"
            ),
            "upload.instructions.browse": t(
              "upload_tab.add_evidence_modal.microcopy.browse"
            )
          }}
          defaultExpanded={true}
          onFilesChange={(files) => setFiles(files)}
        />
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("upload_tab.add_evidence_modal.confirm_label")}
        onConfirmClick={() => onConfirmClick(files)}
        isConfirmButtonDisabled={files.length === 0}
        cancelLabel={t("upload_tab.add_evidence_modal.cancel_label")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
