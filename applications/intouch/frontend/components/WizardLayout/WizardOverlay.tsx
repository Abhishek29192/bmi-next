import React from "react";
import { gql } from "@apollo/client";
import { Project } from "@bmi/intouch-api-types";
import { GetProjectQuery } from "../../graphql/generated/operations";
import { Wizard } from "./Wizard";
import {
  Review,
  SelectEvidence,
  SelectGuarantee,
  SelectGuaranteesTemplate
} from "./Steps";
import { SelectProductOrSystem } from "./Steps/SelectProductOrSystem";
import { GuaranteeWizardData } from "./WizardContext";

type WizardOverlayProps = {
  project: GetProjectQuery["project"];
  onClose?: () => void;
  onSubmit?: (data: GuaranteeWizardData) => void;
};

const WizardOverlay = ({ project, onClose, onSubmit }: WizardOverlayProps) => {
  return (
    <Wizard
      onCloseClick={onClose}
      onSubmitClick={onSubmit}
      project={project as Project}
    >
      <SelectGuarantee />
      <SelectGuaranteesTemplate />
      <SelectProductOrSystem />
      <SelectEvidence />
      <Review />
    </Wizard>
  );
};

export default WizardOverlay;

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
