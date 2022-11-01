import {
  AlertBanner,
  Dialog,
  Typography,
  Upload
} from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

type UploadDialogProps = {
  isOpen: boolean;
  errors?: string;
  loading?: boolean;
  onCloseClick: () => void;
  onFilesChange?: () => void;
  onConfirmClick: (files: File[]) => void;
};
// You cannot upload files larger than <MAX_FILE_SIZE> MB (It's megabyte)
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
  const [hasMaxFileSizeReached, setHasMaxFileSizeReached] = useState(false);
  const [hasMaxTotalSizeReached, setHasMaxTotalSizeReached] = useState(false);

  let totalSize = 0;

  useEffect(() => {
    setHasMaxFileSizeReached(false);
    setHasMaxTotalSizeReached(false);
    files.map(function (item) {
      if (item.size > MAX_FILE_SIZE * (1024 * 1024)) {
        setHasMaxFileSizeReached(true);
      }
      totalSize += item.size;
    });
    if (totalSize > MAX_FILE_SIZE * (1024 * 1024)) {
      setHasMaxTotalSizeReached(true);
    }
  }, [files]);

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
        {hasMaxTotalSizeReached && (
          <Typography variant="default" className={styles.validationMessage}>
            {t("document.uploadDialog.total_files_size", {
              totalSize: `${MAX_FILE_SIZE}MB`
            })}
          </Typography>
        )}
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("document.uploadDialog.confirmLabel")}
        onConfirmClick={() => onConfirmClick(files)}
        isConfirmButtonDisabled={
          loading ||
          files.length === 0 ||
          hasMaxFileSizeReached ||
          hasMaxTotalSizeReached
        }
        cancelLabel={t("document.uploadDialog.cancelLabel")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
