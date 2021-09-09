import React from "react";
import Typography from "@bmi/typography";
import AlertBanner from "@bmi/alert-banner";
import { useTranslation } from "next-i18next";
import { InfoPair } from "../../InfoPair";
import { useWizardContext } from "../WizardContext";
import { WizardProductDetailCard } from "../WizardProductDetailCard";
import { WizardSystemDetailCard } from "../WizardSystemDetailCard";
import styles from "./styles.module.scss";

const Review = () => {
  const { t } = useTranslation("project-page");
  const { data, project } = useWizardContext();

  const responsibleInstaller = project.projectMembers?.nodes?.find(
    (node) => node.isResponsibleInstaller === true
  );
  const evidences = data.guaranteeType.evidenceCategoriesCollection.items;

  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        {t("guarantee_tab.apply_guarantee.review.header")}
      </Typography>
      <InfoPair
        title={t("guarantee_tab.apply_guarantee.review.preferred_language")}
      >
        {data.guaranteeTemplate.displayName}
      </InfoPair>

      {data.product && (
        <InfoPair
          title={t("guarantee_tab.apply_guarantee.review.product_title")}
        >
          <WizardProductDetailCard
            name={data.product.name}
            description={data.product.description}
            brand={data.product.brand}
            family={data.product.family}
          />
        </InfoPair>
      )}

      {data.system && (
        <InfoPair
          title={t("guarantee_tab.apply_guarantee.review.system_title")}
        >
          <WizardSystemDetailCard
            name={data.system.name}
            description={data.system.description}
            products={data.system.systemMembersBySystemBmiRef.nodes?.map(
              ({ productByProductBmiRef }) => productByProductBmiRef
            )}
          />
        </InfoPair>
      )}
      <Typography variant="h4" hasUnderline>
        {t("guarantee_tab.apply_guarantee.review.receipt_title")}
      </Typography>
      {data.evidences && (
        <InfoPair
          title={t("guarantee_tab.apply_guarantee.review.receipt_subTitle")}
        >
          {data.evidences.map((evidence, index) => (
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

      {responsibleInstaller && (
        <div>
          <Typography variant="h4" hasUnderline>
            <div>{t("responsible_installer.title")}</div>
          </Typography>
          <InfoPair title={t("responsible_installer.contact_detail")}>
            {`${responsibleInstaller.account.firstName} ${responsibleInstaller.account.lastName}`}
          </InfoPair>
        </div>
      )}
      {(!responsibleInstaller || evidences.length > 0) && (
        <div className={styles.required}>
          <Typography variant="h4" hasUnderline>
            {t("guarantee_tab.apply_guarantee.review.required.title")}
          </Typography>
          {evidences.length > 0 && (
            <InfoPair
              title={t(
                "guarantee_tab.apply_guarantee.review.required.evidence"
              )}
            >
              <ul>
                {evidences.map((evidence, index) => (
                  <li key={`evidence-${index}`}>{evidence.name}</li>
                ))}
              </ul>
            </InfoPair>
          )}

          {!responsibleInstaller && (
            <InfoPair
              title={t(
                "guarantee_tab.apply_guarantee.review.responsible_installer.title"
              )}
            >
              {t(
                "guarantee_tab.apply_guarantee.review.responsible_installer.description"
              )}
            </InfoPair>
          )}
        </div>
      )}
      <AlertBanner severity="info">
        <AlertBanner.Title>
          {t("guarantee_tab.apply_guarantee.review.alert_banner.title")}
        </AlertBanner.Title>
        {t("guarantee_tab.apply_guarantee.review.alert_banner.description")}
      </AlertBanner>
    </div>
  );
};

export default Review;
