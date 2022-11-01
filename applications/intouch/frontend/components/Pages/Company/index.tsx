import React from "react";
import { Grid } from "@bmi-digital/components";
import { useTranslation } from "react-i18next";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { ROLES } from "../../../lib/constants";
import { GlobalPageProps } from "../../../lib/middleware/withPage";
import AccessControl from "../../../lib/permissions/AccessControl";
import { validateCompanyProfile } from "../../../lib/validations/company";
import GridStyles from "../../../styles/Grid.module.scss";
import { CertificationsCard } from "../../Cards/Certifications";
import { CompanyActionsCard } from "../../Cards/CompanyActions";
import { SupportContactCard } from "../../Cards/SupportContactCard";
import { OnCompanyUpdateSuccess } from "../../SetCompanyDetailsDialog";
import { CompanyAdmins } from "./Admins";
import { CompanyDetails } from "./Details";
import { CompanyDocuments } from "./Documents";
import { EditCompanyButton } from "./EditCompany/Button";
import { IncompleteProfileAlert } from "./IncompleteProfileAlert";
import { CompanyRegisteredDetails } from "./RegisteredDetails";
import { RewardSummary } from "./RewardSummary";
import styles from "./styles.module.scss";

type Props = GlobalPageProps & {
  company: GetCompanyQuery["company"];
  contactDetailsCollection: GetCompanyQuery["contactDetailsCollection"];
  onCompanyUpdateSuccess: OnCompanyUpdateSuccess;
  mapsApiKey: string;
};

export const NoCompanies = () => {
  const { t } = useTranslation("company-page");
  return (
    <div className={styles.container}>{t("company-page:noCompanies")}</div>
  );
};

export const CompanyPage = ({
  company,
  contactDetailsCollection,
  onCompanyUpdateSuccess,
  mapsApiKey
}: Props) => {
  const { t } = useTranslation("company-page");
  const { missingFields } = validateCompanyProfile(company);
  return (
    <div>
      {missingFields.length > 0 && (
        <IncompleteProfileAlert missingFields={missingFields} />
      )}
      <Grid
        nonce={undefined}
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid nonce={undefined} item xs={12} lg={7} xl={8}>
          <CompanyDetails
            company={company}
            showName={false}
            actions={
              <EditCompanyButton
                company={company}
                mapsApiKey={mapsApiKey}
                onCompanyUpdateSuccess={onCompanyUpdateSuccess}
              />
            }
          />
          <CompanyAdmins
            admins={company.companyMembers.nodes.filter(
              ({ account }) => account.role === ROLES.COMPANY_ADMIN
            )}
            title={t("companyAdministrators")}
          />
          <CompanyAdmins
            admins={company.companyMembers.nodes.filter(
              ({ account }) => account.role === ROLES.INSTALLER
            )}
            title={t("companyMembers")}
          />
          <CompanyDocuments
            companyId={company.id}
            documents={company.companyDocuments}
            onCompanyDocumentsUpdate={() => {
              onCompanyUpdateSuccess(company);
            }}
          />
        </Grid>
        <Grid nonce={undefined} item xs={12} lg={5} xl={4}>
          <RewardSummary company={company} />
          <CompanyRegisteredDetails
            company={company}
            mapsApiKey={mapsApiKey}
            onCompanyUpdateSuccess={onCompanyUpdateSuccess}
          />
          <SupportContactCard
            contactDetailsCollection={contactDetailsCollection}
          />

          {company.certifications.length > 0 && (
            <CertificationsCard
              title={t("certificationsTitle")}
              certifications={[...company.certifications]}
            />
          )}
        </Grid>
        <AccessControl dataModel="company" action="editOperations">
          <Grid nonce={undefined} item xs={12} lg={12} xl={12}>
            <CompanyActionsCard
              title={t("companyActionsTitle")}
              company={company}
              onCompanyUpdateSuccess={onCompanyUpdateSuccess}
            />
          </Grid>
        </AccessControl>
      </Grid>
    </div>
  );
};
