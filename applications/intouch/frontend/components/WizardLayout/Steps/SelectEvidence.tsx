import React from "react";
import { Upload } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import { useWizardContext } from "../WizardContext";

const SelectEvidence = () => {
  const { data, setData } = useWizardContext();
  const { t } = useTranslation("project-page");

  const onFilesChangeHandler = (evidences) => {
    setData({
      ...data,
      evidences
    });
  };

  return (
    <Upload
      id={"add-evidence"}
      name={"add-evidence"}
      buttonLabel={t("upload_tab.add_evidence_modal.button_label")}
      accept=".pdf,.jpg,.jpeg,.png"
      instructions={t("upload_tab.add_evidence_modal.instruction")}
      mapValue={(file) => file}
      mapBody={(file) => file}
      microcopyProvider={{
        "upload.instructions.drop": t(
          "upload_tab.add_evidence_modal.microcopy.drop"
        ),
        "upload.instructions.browse": t(
          "upload_tab.add_evidence_modal.microcopy.browse"
        )
      }}
      defaultExpanded={true}
      onFilesChange={onFilesChangeHandler}
      value={data.evidences}
    />
  );
};

export default SelectEvidence;
