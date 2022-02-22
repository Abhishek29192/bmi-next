import React, { useEffect, useState } from "react";
import { Tooltip } from "@bmi/components";
import { GuaranteeType } from "@bmi/intouch-api-types";
import { AlertBanner } from "@bmi/components";
import { useTranslation } from "next-i18next";
import { ActionTile } from "../../../components/ActionTile";
import { useWizardContext } from "../WizardContext";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { useGetProductGuaranteeTypesLazyQuery } from "../../../graphql/generated/hooks";

export type SelectGuaranteeType = {
  guaranteeType: GuaranteeType;
  isDisabled: boolean;
  tooltipHint: string;
};

const SelectGuarantee = () => {
  const { data, project, setData } = useWizardContext();
  const { t } = useTranslation("project-page");

  const { technology } = project;
  const [guaranteeTypes, setGuaranteeTypes] = useState<SelectGuaranteeType[]>(
    []
  );

  const [productGuaranteeTypes] = useGetProductGuaranteeTypesLazyQuery({
    onCompleted: ({ guaranteeTypeCollection }) => {
      const guaranteeTypesSelect = getProductGuarantees(
        project,
        guaranteeTypeCollection.items as GuaranteeType[]
      );

      setGuaranteeTypes(guaranteeTypesSelect);
    }
  });

  useEffect(() => {
    productGuaranteeTypes({
      variables: {
        technology: technology
      }
    });
  }, [technology]);

  const onClickHandler = (guaranteeType: GuaranteeType) => {
    setData({
      ...data,
      guaranteeType: guaranteeType,
      guaranteeTemplate: null,
      product: null,
      system: null
    });
  };
  if (!guaranteeTypes?.length) {
    return (
      <div>
        <AlertBanner severity={"warning"}>
          <AlertBanner.Title>
            {t("guarantee_tab.apply_guarantee.alert.selectGuarantee.title")}
          </AlertBanner.Title>
          {t("guarantee_tab.apply_guarantee.alert.selectGuarantee.message")}
        </AlertBanner>
      </div>
    );
  }

  return (
    <div>
      {guaranteeTypes.map((guarantee) => (
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
                onClickHandler(guarantee.guaranteeType);
              }}
              isSelected={
                data?.guaranteeType?.sys?.id === guarantee.guaranteeType.sys.id
              }
            />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

const getProductGuarantees = (
  project: GetProjectQuery["project"],
  quaranteeTypes: GuaranteeType[]
): SelectGuaranteeType[] => {
  const { company, guarantees } = project;

  const isproductGuaranteeExist: boolean = guarantees.nodes.some(
    (k) => k.status == "APPROVED" && k.guaranteeType.coverage === "PRODUCT"
  );

  return quaranteeTypes.map((guaranteeType) => {
    const isTierAvailable: boolean = guaranteeType.tiersAvailable.includes(
      company?.tier
    );

    if (!isTierAvailable) {
      return {
        guaranteeType,
        isDisabled: true,
        tooltipHint: "guarantee_tab.apply_guarantee.message.not_available_tier"
      };
    }

    if (
      isproductGuaranteeExist &&
      ["SYSTEM", "SOLUTION"].includes(guaranteeType.coverage)
    ) {
      return {
        guaranteeType,
        isDisabled: true,
        tooltipHint:
          "guarantee_tab.apply_guarantee.message.guarantee_exists_error"
      };
    }

    return {
      guaranteeType,
      isDisabled: false,
      tooltipHint: ""
    };
  });
};
export default SelectGuarantee;
