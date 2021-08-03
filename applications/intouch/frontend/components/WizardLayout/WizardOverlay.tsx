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

type WizardOverlayProps = {
  project: GetProjectQuery["project"];
  onClose?: () => void;
};

const WizardOverlay = ({ project, onClose }: WizardOverlayProps) => {
  return (
    <Wizard onCloseClick={onClose} project={project as Project}>
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
