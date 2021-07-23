import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@bmi/dialog";
import { gql } from "@apollo/client";
import { GuaranteeType } from "@bmi/intouch-api-types";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { useGetProductGuaranteeTypesLazyQuery } from "../../../graphql/generated/hooks";
import { SelectGuarantee, SelectGuarantees } from "./Steps/SelectGuarantee";

type ApplyGuaranteeDialogProps = {
  isOpen: boolean;
  project: GetProjectQuery["project"];
  onCloseClick: () => void;
  onConfirmClick: () => void;
};
export const ApplyGuaranteeDialog = ({
  isOpen,
  project,
  onCloseClick,
  onConfirmClick
}: ApplyGuaranteeDialogProps) => {
  const { t } = useTranslation("project-page");
  const [guaranteeTypes, setGuaranteeTypes] = useState<SelectGuarantees[]>([]);
  const { technology, company, guarantees } = project;
  const [productGuaranteeTypes] = useGetProductGuaranteeTypesLazyQuery({
    onCompleted: ({ guaranteeTypeCollection }) => {
      const guaranteeTypesSelect = getProductGuarantees(
        guaranteeTypeCollection.items as GuaranteeType[]
      );

      setGuaranteeTypes(guaranteeTypesSelect);
    }
  });

  const getProductGuarantees = (
    quaranteeTypes: GuaranteeType[]
  ): SelectGuarantees[] => {
    const isproductGuaranteeExist: boolean = guarantees.nodes.some(
      (k) => k.status == "APPROVED" && k.guaranteeType.coverage === "PRODUCT"
    );

    return quaranteeTypes.map((guaranteeType) => {
      const coverages = ["SYSTEM", "SOLUTION"];
      const isTierAvailable: boolean = guaranteeType.tiersAvailable.includes(
        company?.tier
      );
      const isSystemOrSolutionGuarantee = coverages.includes(
        guaranteeType.coverage
      );

      if (!isTierAvailable) {
        return {
          guaranteeType,
          status: false,
          message: t("guarantee_tab.apply_guarantee.message.not_available_tier")
        };
      }

      if (isproductGuaranteeExist && isSystemOrSolutionGuarantee) {
        return {
          guaranteeType,
          status: false,
          message: t(
            "guarantee_tab.apply_guarantee.message.exist_product_guarantee"
          )
        };
      }

      return {
        guaranteeType,
        status: true,
        message: ""
      };
    });
  };

  useEffect(() => {
    productGuaranteeTypes({
      variables: {
        tecnology: technology
      }
    });
  }, [technology]);

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick}>
      <Dialog.Title hasUnderline>
        {t("guarantee_tab.apply_guarantee.title")}
      </Dialog.Title>
      <Dialog.Content>
        <SelectGuarantee guarantees={guaranteeTypes} />
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={t("guarantee_tab.apply_guarantee.confirm_label")}
        onConfirmClick={() => onConfirmClick}
        isConfirmButtonDisabled={false}
        cancelLabel={t("guarantee_tab.apply_guarantee.cancel_label")}
        onCancelClick={() => onCloseClick()}
      />
    </Dialog>
  );
};

export const GET_PRODUCT_GUARANTEE_TYPES = gql`
  query getProductGuaranteeTypes($tecnology: String) {
    guaranteeTypeCollection(
      order: ranking_ASC
      where: { technology: $tecnology }
    ) {
      items {
        sys {
          id
        }
        name
        displayName
        technology
        coverage
        ranking
        tiersAvailable
      }
    }
  }
`;
