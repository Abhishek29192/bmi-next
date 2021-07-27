import React, { useState, useEffect } from "react";
import Dialog from "@bmi/dialog";
import { gql } from "@apollo/client";
import { GuaranteeType } from "@bmi/intouch-api-types";
import { Wizard } from "../../../components/WizardLayout";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { useGetProductGuaranteeTypesLazyQuery } from "../../../graphql/generated/hooks";
import {
  SelectGuarantee,
  SelectGuaranteesTemplate,
  SelectGuaranteeType
} from "./Steps";

type ApplyGuaranteeDialogProps = {
  isOpen: boolean;
  project: GetProjectQuery["project"];
  onCloseClick: () => void;
};
export const ApplyGuaranteeDialog = ({
  isOpen,
  project,
  onCloseClick
}: ApplyGuaranteeDialogProps) => {
  const [guaranteeTypes, setGuaranteeTypes] = useState<SelectGuaranteeType[]>(
    []
  );
  const { technology } = project;
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
    if (isOpen) {
      productGuaranteeTypes({
        variables: {
          tecnology: technology
        }
      });
    }
  }, [isOpen, technology]);

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick} maxWidth={"xl"}>
      <Dialog.Content>
        <Wizard>
          <SelectGuarantee guarantees={guaranteeTypes} />
          <SelectGuaranteesTemplate />
        </Wizard>
      </Dialog.Content>
    </Dialog>
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
        guaranteeTemplatesCollection {
          items {
            displayName
          }
        }
      }
    }
  }
`;
