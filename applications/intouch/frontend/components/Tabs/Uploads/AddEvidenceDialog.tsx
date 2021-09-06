import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@bmi/dialog";
import Upload from "@bmi/upload";
import Select, { MenuItem } from "@bmi/select";
import { EvidenceCategoryType } from "@bmi/intouch-api-types";

export type EvidenceCategory = {
  id: string;
  name: string;
};

type AddEvidenceDialogProps = {
  isOpen: boolean;
  evidenceCategories?: EvidenceCategory[];
  onCloseClick: () => void;
  onConfirmClick: (
    evidenceCategoryType: EvidenceCategoryType,
    customEvidenceCategoryId: string,
    files: File[]
  ) => void;
};
//You cannot upload  files larger than <MAX_FILE_SIZE> MB (It's megabyte)
const MAX_FILE_SIZE: number = 25;

export const AddEvidenceDialog = ({
  isOpen,
  evidenceCategories = [],
  onCloseClick,
  onConfirmClick
}: AddEvidenceDialogProps) => {
  const { t } = useTranslation("project-page");
  const [files, setFiles] = useState<File[]>([]);
  const [evidenceCategoryId, setEvidenceCategoryId] = useState("MISCELLANEOUS");

  const onSelectChangeHandler = (id) => {
    setEvidenceCategoryId(id);
  };

  const addEvidenceHandler = () => {
    let evidenceCategoryType: EvidenceCategoryType = "MISCELLANEOUS";
    let customEvidenceCategoryId: string = null;

    if (
      evidenceCategories.length > 0 &&
      evidenceCategoryId !== "MISCELLANEOUS"
    ) {
      customEvidenceCategoryId = evidenceCategoryId;
      evidenceCategoryType = "CUSTOM";
    }

    onConfirmClick(evidenceCategoryType, customEvidenceCategoryId, files);
  };

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("upload_tab.add_evidence_modal.title")}
      </Dialog.Title>
      <Dialog.Content>
        <div style={{ margin: "15px 0" }}>
          {evidenceCategories.length > 0 && (
            <Select
              name="evidenceCategories"
              label={t("upload_tab.add_evidence_modal.evidence_category")}
              isRequired
              onChange={onSelectChangeHandler}
              value={evidenceCategoryId}
              fullWidth={true}
            >
              <MenuItem value={"MISCELLANEOUS"} key={"MISCELLANEOUS"}>
                {t("MISCELLANEOUS")}
              </MenuItem>
              {(evidenceCategories || []).map(({ id, name }, index) => (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
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
        isConfirmButtonDisabled={files.length === 0}
        cancelLabel={t("upload_tab.add_evidence_modal.cancel_label")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};
