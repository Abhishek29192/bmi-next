import React from "react";
import Link from "next/link";
import Icon from "@bmi-digital/components/icon";
import { BMI } from "@bmi-digital/components/logo";
import Typography from "@bmi-digital/components/typography";
import AlertBanner from "@bmi-digital/components/alert-banner";
import Button from "@bmi-digital/components/button";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
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
    <Dialog fullScreen open={isOpen} onClose={onCloseClick}>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.header__inner}>
            <Link href="/">
              <Icon source={BMI} className={styles.logo} />
            </Link>

            <Button variant="text" isIconButton onClick={onCloseClick}>
              <CloseIcon color="primary" />
            </Button>
          </div>
        </div>
        <GuaranteeReview project={project} />
        <div className={styles.footer}>
          <div className={styles.footer__inner}>
            <Button size="large" onClick={onSubmitClick}>
              {t("guarantee_tab.apply_guarantee.wizard.footer.submit")}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
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
  const getEvidenceCategoryName = (
    evidence: GetProjectQuery["project"]["evidenceItems"]["nodes"][0]
  ) => {
    return evidence.evidenceCategoryType === "CUSTOM"
      ? evidence.customEvidenceCategory?.name
      : evidence.evidenceCategoryType;
  };

  return (
    <div className={styles.body}>
      <Typography variant="h4" style={{ marginBottom: "1rem" }} hasUnderline>
        {t("tabs.uploads")}
      </Typography>
      {evidences && (
        <InfoPair title="">
          {evidences.map((evidence, index) => (
            <div key={index}>
              {t(getEvidenceCategoryName(evidence))} : {evidence.name}
            </div>
          ))}
        </InfoPair>
      )}

      <Typography variant="h4" style={{ marginBottom: "1rem" }} hasUnderline>
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
  );
};

export const UPDATE_GUARANTEE = gql`
  mutation updateGuarantee($input: UpdateGuaranteeInput!) {
    updateGuarantee(input: $input) {
      guarantee {
        id
        coverage
        status
      }
    }
  }
`;
