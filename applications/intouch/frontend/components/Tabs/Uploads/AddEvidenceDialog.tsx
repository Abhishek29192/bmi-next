import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Dialog } from "@bmi-digital/components";
import { Upload } from "@bmi-digital/components";
import { Select, SelectMenuItem } from "@bmi-digital/components";
import {
  ContentfulEvidenceCategory,
  CustomEvidenceCategoryKey,
  EvidenceCategoryType
} from "@bmi/intouch-api-types";
import { DeepPartial } from "../../../lib/utils/types";

type AddEvidenceDialogProps = {
  isOpen: boolean;
  loading: boolean;
  evidenceCategories?: DeepPartial<ContentfulEvidenceCategory>[];
  onCloseClick: () => void;
  onConfirmClick: (
    evidenceCategoryType: EvidenceCategoryType,
    customEvidenceCategoryKey: CustomEvidenceCategoryKey,
    files: File[]
  ) => void;
};
//You cannot upload  files larger than <MAX_FILE_SIZE> MB (It's megabyte)
const MAX_FILE_SIZE = 25;

type EvidenceCategoryKey = CustomEvidenceCategoryKey | "MISCELLANEOUS";

export const AddEvidenceDialog = ({
  isOpen,
  evidenceCategories = [],
  onCloseClick,
  onConfirmClick,
  loading
}: AddEvidenceDialogProps) => {
  const { t } = useTranslation("project-page");
  const [files, setFiles] = useState<File[]>([]);
  const [evidenceCategoryKey, setEvidenceCategoryKey] =
    useState<EvidenceCategoryKey>("MISCELLANEOUS");

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
    setEvidenceCategoryKey("MISCELLANEOUS");
  }, []);

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
          mapValue={() => {
            // no-op
          }}
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
          fileValidation={(file) =>
            file.size > MAX_FILE_SIZE * (1024 * 1024)
              ? `${t(
                  "upload_tab.add_evidence_modal.file_validation_message"
                )} ${MAX_FILE_SIZE}MB`
              : null
          }
        />
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("upload_tab.add_evidence_modal.confirm_label")}
        onConfirmClick={addEvidenceHandler}
        isConfirmButtonDisabled={loading || files.length === 0}
        cancelLabel={t("upload_tab.add_evidence_modal.cancel_label")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
