import React from "react";
import Tooltip from "@bmi/tooltip";
import { ActionTile } from "../../../ActionTile";
import { useWizardContext } from "../../../../context/WizardContext";

export const SelectGuaranteesTemplate = () => {
  const { data } = useWizardContext();

  const templates = data.guaranteeType?.guaranteeTemplatesCollection?.items;

  return (
    <div>
      {(templates || []).map((template) => (
        <Tooltip
          title={template.displayName}
          key={template.displayName}
          style={{ padding: "5px" }}
        >
          <div>
            <ActionTile
              title={template.displayName}
              description={template.displayName}
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log(template);
              }}
            />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
