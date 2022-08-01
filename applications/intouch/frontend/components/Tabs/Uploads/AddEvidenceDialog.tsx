import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Dialog, Typography } from "@bmi/components";
import { Upload } from "@bmi/components";
import { Select, SelectMenuItem } from "@bmi/components";
import {
  ContentfulEvidenceCategory,
  CustomEvidenceCategoryKey,
  EvidenceCategoryType
} from "@bmi/intouch-api-types";
import { DeepPartial } from "../../../lib/utils/types";
import styles from "./styles.module.scss";

type AddEvidenceDialogProps = {
  isOpen: boolean;
  loading: boolean;
  evidenceCategories?: DeepPartial<ContentfulEvidenceCategory>[];
  defaultEvidenceCategory?: EvidenceCategoryKey;
  onCloseClick: () => void;
  onConfirmClick: (
    evidenceCategoryType: EvidenceCategoryType,
    customEvidenceCategoryKey: CustomEvidenceCategoryKey,
    files: File[]
  ) => void;
};
// You cannot upload files larger than <MAX_FILE_SIZE> MB (It's megabyte)
const MAX_FILE_SIZE = 40;

type EvidenceCategoryKey = CustomEvidenceCategoryKey | "MISCELLANEOUS";

export const AddEvidenceDialog = ({
  isOpen,
  evidenceCategories = [],
  defaultEvidenceCategory,
  onCloseClick,
  onConfirmClick,
  loading
}: AddEvidenceDialogProps) => {
  const { t } = useTranslation("project-page");
  const [files, setFiles] = useState<File[]>([]);
  const [hasMaxFileSizeReached, setHasMaxFileSizeReached] = useState(false);
  const [hasMaxTotalSizeReached, setHasMaxTotalSizeReached] = useState(false);
  const [evidenceCategoryKey, setEvidenceCategoryKey] =
    useState<EvidenceCategoryKey>(defaultEvidenceCategory || "MISCELLANEOUS");

  let totalSize = 0;

  const onSelectChangeHandler = (id: EvidenceCategoryKey) => {
    setEvidenceCategoryKey(id);
  };

  const addEvidenceHandler = () => {
    const evidenceCategoryType: EvidenceCategoryType =
      evidenceCategoryKey === "MISCELLANEOUS" ? "MISCELLANEOUS" : "CUSTOM";
    const customEvidenceCategoryKey: CustomEvidenceCategoryKey =
      evidenceCategoryKey === "MISCELLANEOUS" ? null : evidenceCategoryKey;

    onConfirmClick(evidenceCategoryType, customEvidenceCategoryKey, files);
  };

  useEffect(() => {
    setEvidenceCategoryKey(defaultEvidenceCategory || "MISCELLANEOUS");
  }, [defaultEvidenceCategory]);

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
        {t("upload_tab.add_evidence_modal.title")}
      </Dialog.Title>
      <Dialog.Content>
        <div style={{ margin: "15px 0" }}>
          {evidenceCategories && (
            <Select
              name="evidenceCategories"
              label={t("upload_tab.add_evidence_modal.evidence_category")}
              isRequired
              onChange={onSelectChangeHandler}
              value={evidenceCategoryKey}
              fullWidth={true}
              data-testid="evidence-categories-list"
            >
              <SelectMenuItem value={"MISCELLANEOUS"} key={"MISCELLANEOUS"}>
                {t("MISCELLANEOUS")}
              </SelectMenuItem>
              {evidenceCategories.map(({ referenceCode, name }, index) => (
                <SelectMenuItem value={referenceCode} key={referenceCode}>
                  {name}
                </SelectMenuItem>
              ))}
            </Select>
          )}
        </div>

        <Upload
          id={"add-evidence"}
          name={"add-evidence"}
          buttonLabel={t("upload_tab.add_evidence_modal.button_label")}
          accept=".pdf,.jpg,.jpeg,.png"
          instructions={t("upload_tab.add_evidence_modal.instruction")}
          mapValue={null}
          mapBody={null}
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
          fileValidation={(file) =>
            file.size > MAX_FILE_SIZE * (1024 * 1024)
              ? `${t(
                  "upload_tab.add_evidence_modal.file_validation_message"
                )} ${MAX_FILE_SIZE}MB`
              : null
          }
        />
        {hasMaxTotalSizeReached && (
          <Typography variant="default" className={styles.validationMessage}>
            {t("upload_tab.add_evidence_modal.total_files_size", {
              totalSize: `${MAX_FILE_SIZE}MB`
            })}
          </Typography>
        )}
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("upload_tab.add_evidence_modal.confirm_label")}
        onConfirmClick={addEvidenceHandler}
        isConfirmButtonDisabled={
          loading ||
          files.length === 0 ||
          hasMaxFileSizeReached ||
          hasMaxTotalSizeReached
        }
        cancelLabel={t("upload_tab.add_evidence_modal.cancel_label")}
        onCancelClick={() => onCloseClick()}
        data-testid="add-evidence-actions"
      />
    </Dialog>
  );
};
