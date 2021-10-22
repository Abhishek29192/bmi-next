import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@bmi/dialog";
import Upload from "@bmi/upload";

type UploadDialogProps = {
  isOpen: boolean;
  onCloseClick: () => void;
  onConfirmClick: (files: File[]) => void;
};
//You cannot upload  files larger than <MAX_FILE_SIZE> MB (It's megabyte)
const MAX_FILE_SIZE: number = 25;

export const UploadDialog = ({
  isOpen,
  onCloseClick,
  onConfirmClick
}: UploadDialogProps) => {
  const { t } = useTranslation("company-page");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("document.uploadDialog.title")}
      </Dialog.Title>
      <Dialog.Content>
        <Upload
          id={"add-company-document"}
          name={"add-company-document"}
          buttonLabel={t("document.uploadDialog.buttonLabel")}
          accept=".pdf,.jpg,.jpeg,.png"
          instructions={t("document.uploadDialog.instruction")}
          mapValue={() => {}}
          mapBody={(file) => ({ file })}
          microcopyProvider={{
            "upload.instructions.drop": t(
              "document.uploadDialog.microcopy.drop"
            ),
            "upload.instructions.browse": t(
              "document.uploadDialog.microcopy.browse"
            )
          }}
          defaultExpanded={true}
          onFilesChange={(files) => setFiles(files)}
          fileValidation={(file) =>
            file.size > MAX_FILE_SIZE * (1024 * 1024)
              ? `${t(
                  "document.uploadDialog.fileValidationMessage"
                )} ${MAX_FILE_SIZE}MB`
              : null
          }
        />
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("document.uploadDialog.confirmLabel")}
        onConfirmClick={() => onConfirmClick(files)}
        isConfirmButtonDisabled={files.length === 0}
        cancelLabel={t("document.uploadDialog.cancelLabel")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
