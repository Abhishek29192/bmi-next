import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import AlertBanner from "@bmi/alert-banner";
import Dialog from "@bmi/dialog";
import Upload from "@bmi/upload";

type UploadDialogProps = {
  isOpen: boolean;
  errors?: string;
  loading?: boolean;
  onCloseClick: () => void;
  onFilesChange?: () => void;
  onConfirmClick: (files: File[]) => void;
};
//You cannot upload  files larger than <MAX_FILE_SIZE> MB (It's megabyte)
const MAX_FILE_SIZE = 25;

export const UploadDialog = ({
  isOpen,
  errors,
  loading,
  onCloseClick,
  onConfirmClick,
  onFilesChange
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
          data-testid="add-company-document"
          buttonLabel={t("document.uploadDialog.buttonLabel")}
          accept=".pdf,.jpg,.jpeg,.png"
          instructions={t("document.uploadDialog.instruction")}
          mapValue={() => {
            // no-op
          }}
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
          onFilesChange={(files) => {
            setFiles(files);
            onFilesChange && onFilesChange();
          }}
          fileValidation={(file) =>
            file.size > MAX_FILE_SIZE * (1024 * 1024)
              ? t("document.uploadDialog.fileValidationMessage", {
                  fileSize: `${MAX_FILE_SIZE}MB`
                })
              : null
          }
        />
        {errors && (
          <div data-testid="uploader-error" style={{ marginTop: 20 }}>
            <AlertBanner
              key={`company-document-uploader-error`}
              severity="error"
            >
              <AlertBanner.Title>{errors}</AlertBanner.Title>
            </AlertBanner>
          </div>
        )}
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("document.uploadDialog.confirmLabel")}
        onConfirmClick={() => onConfirmClick(files)}
        isConfirmButtonDisabled={loading || files.length === 0}
        cancelLabel={t("document.uploadDialog.cancelLabel")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
