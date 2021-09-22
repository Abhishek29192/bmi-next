import React from "react";
import Typography from "@bmi/typography";
import AlertBanner from "@bmi/alert-banner";
import Button from "@bmi/button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import { InfoPair } from "../../../InfoPair";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import {
  GetProjectDocument,
  useUpdateGuaranteeMutation
} from "../../../../graphql/generated/hooks";
import styles from "./styles.module.scss";

type SolutionGuaranteeReviewProps = {
  isOpen: boolean;
  project: GetProjectQuery["project"];
  onCloseClick: () => void;
};
const SolutionGuaranteeReviewDialog = ({
  isOpen,
  project,
  onCloseClick
}: SolutionGuaranteeReviewProps) => {
  const { t } = useTranslation("project-page");

  const [updateGuarantee] = useUpdateGuaranteeMutation({
    onCompleted: (data) => {
      onCloseClick();
    },
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: {
          projectId: project.id
        }
      }
    ]
  });

  const onSubmitClick = () => {
    const guarantee = project.guarantees.nodes[0];

    const id = guarantee.id;
    updateGuarantee({
      variables: {
        input: {
          id: id,
          guaranteeEventType: "SUBMIT_SOLUTION",
          patch: {}
        }
      }
    });
  };

  return (
    <div>
      <Dialog fullScreen open={isOpen} onClose={onCloseClick}>
        <DialogTitle>{t("guarantee.type.SOLUTION")}</DialogTitle>
        <DialogContent>
          <GuaranteeReview project={project} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onSubmitClick} color="primary">
            {t("guarantee_tab.apply_guarantee.wizard.footer.submit")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SolutionGuaranteeReviewDialog;

type GuaranteeReviewProps = {
  project: GetProjectQuery["project"];
};
const GuaranteeReview = ({ project }: GuaranteeReviewProps) => {
  const { t } = useTranslation("project-page");

  const guarantee = project?.guarantees?.nodes?.[0];

  const evidences = project.evidenceItems.nodes.filter(
    (evidence) => evidence.guaranteeId === guarantee.id
  );

  return (
    <div className={styles.main}>
      <div className={styles.body}>
        <Typography variant="h4" hasUnderline>
          {t("guarantee_tab.apply_guarantee.review.receipt_title")}
        </Typography>
        {evidences && (
          <InfoPair
            title={t("guarantee_tab.apply_guarantee.review.receipt_subTitle")}
          >
            {evidences.map((evidence, index) => (
              <div key={index}>{evidence.name}</div>
            ))}
          </InfoPair>
        )}

        <Typography variant="h4" hasUnderline>
          {t("building_owner.title")}
        </Typography>
        <InfoPair title={t("building_owner.contact_detail")}>
          {`${project.buildingOwnerFirstname} ${project.buildingOwnerLastname}`}
        </InfoPair>
        <InfoPair title={t("building_owner.email")}>
          {project.buildingOwnerMail}
        </InfoPair>
        <InfoPair title={t("building_owner.address")}>
          {`${project.buildingOwnerAddress?.firstLine}, ${project.buildingOwnerAddress?.secondLine}, ${project.buildingOwnerAddress?.region}, ${project.buildingOwnerAddress?.town}, ${project.buildingOwnerAddress?.postcode}`}
        </InfoPair>

        <AlertBanner severity="info">
          <AlertBanner.Title>
            {t("guarantee_tab.apply_guarantee.review.alert_banner.title")}
          </AlertBanner.Title>
          {t("guarantee_tab.apply_guarantee.review.alert_banner.description")}
        </AlertBanner>
      </div>
    </div>
  );
};

export const UPDATE_GUARANTEE = gql`
  mutation updateGuarantee($input: UpdateGuaranteeInput!) {
    updateGuarantee(input: $input) {
      guarantee {
        id
      }
    }
  }
`;
