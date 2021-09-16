import React, { useEffect } from "react";
import Select, { MenuItem } from "@bmi/select";
import { useWizardContext } from "../WizardContext";

const SelectGuaranteesTemplate = () => {
  const { data, setData } = useWizardContext();

  const templates = data.guaranteeType?.guaranteeTemplatesCollection?.items;
  const selectedTemplate = data?.guaranteeTemplate?.sys?.id || "";

  useEffect(() => {
    if (templates?.length > 0 && !data?.guaranteeTemplate) {
      onChangeHandler(templates[0].sys.id);
    }
  }, []);

  const onChangeHandler = (templateId) => {
    const guaranteeTemplate =
      data.guaranteeType?.guaranteeTemplatesCollection?.items.find(
        (item) => item.sys.id === templateId
      );
    setData({ ...data, guaranteeTemplate: guaranteeTemplate });
  };

  return (
    <div>
      <Select
        name="template"
        label="Language"
        isRequired
        style={{ margin: "10px" }}
        onChange={onChangeHandler}
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

export default SelectGuaranteesTemplate;
