import React, { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { GuaranteeType } from "@bmi/intouch-api-types";
import { GetProjectQuery } from "../../graphql/generated/operations";
import { useGetProductGuaranteeTypesLazyQuery } from "../../graphql/generated/hooks";
import { Wizard } from "./Wizard";
import {
  SelectGuarantee,
  SelectGuaranteesTemplate,
  SelectGuaranteeType,
  SelectProducts
} from "./Steps";

type WizardOverlayProps = {
  project: GetProjectQuery["project"];
  onClose?: () => void;
};

const WizardOverlay = ({ project, onClose }: WizardOverlayProps) => {
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

  useEffect(() => {}, []);
  useEffect(() => {
    productGuaranteeTypes({
      variables: {
        tecnology: technology
      }
    });
  }, [technology]);

  return (
    <Wizard onCloseClick={onClose}>
      <SelectGuarantee guarantees={guaranteeTypes} />
      <SelectGuaranteesTemplate />
      <SelectProducts />
    </Wizard>
  );
};

export default WizardOverlay;

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
  query getProductGuaranteeTypes($technology: String) {
    guaranteeTypeCollection(
      order: ranking_ASC
      where: { technology: $technology }
      limit: 10
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
            sys {
              id
            }
            displayName
          }
        }
      }
    }
  }
`;
