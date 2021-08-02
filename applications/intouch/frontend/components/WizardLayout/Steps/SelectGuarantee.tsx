import React from "react";
import Tooltip from "@bmi/tooltip";
import { GuaranteeType } from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import { ActionTile } from "../../../components/ActionTile";
import { useWizardContext } from "../WizardContext";

export type SelectGuaranteeType = {
  guaranteeType: GuaranteeType;
  isDisabled: boolean;
  tooltipHint: string;
};

type SelectGuaranteeProps = {
  guarantees: SelectGuaranteeType[];
  onClick?: (guaranteeType: GuaranteeType) => void;
};

export const SelectGuarantee = ({ guarantees }: SelectGuaranteeProps) => {
  const { data, setData } = useWizardContext();
  const { t } = useTranslation("project-page");
  return (
    <div>
      {guarantees.map((guarantee) => (
        <Tooltip
          title={t(guarantee.tooltipHint)}
          key={guarantee.guaranteeType.name}
          style={{ padding: "5px" }}
        >
          <div>
            <ActionTile
              title={guarantee.guaranteeType.displayName}
              description={guarantee.guaranteeType.name}
              disabled={guarantee.isDisabled}
              onClick={() => {
                setData({
                  ...data,
                  guaranteeType: guarantee.guaranteeType
                });
              }}
            />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
