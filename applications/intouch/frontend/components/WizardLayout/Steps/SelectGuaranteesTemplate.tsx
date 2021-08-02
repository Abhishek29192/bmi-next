import React from "react";
import Select, { MenuItem } from "@bmi/select";
import { useWizardContext } from "../WizardContext";

export const SelectGuaranteesTemplate = () => {
  const { data, setData } = useWizardContext();

  const templates = data.guaranteeType?.guaranteeTemplatesCollection?.items;
  const selectedTemplate = data.guaranteeTemplateId;

  return (
    <div>
      <Select
        name="template"
        label="Language"
        isRequired
        style={{ margin: "20px" }}
        onChange={(value) => {
          setData({ ...data, guaranteeTemplateId: value });
        }}
        value={selectedTemplate}
      >
        {(templates || []).map((template) => (
          <MenuItem value={template.sys.id} key={template.displayName}>
            {template.displayName}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
