import React from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@bmi/components";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { GlobalPageProps } from "../../../lib/middleware/withPage";
import { ROLES } from "../../../lib/constants";
import AccessControl from "../../../lib/permissions/AccessControl";
import { validateCompanyProfile } from "../../../lib/validations/company";
import GridStyles from "../../../styles/Grid.module.scss";
import { SupportContactCard } from "../../Cards/SupportContactCard";
import { CertificationsCard } from "../../Cards/Certifications";
import { CompanyActionsCard } from "../../Cards/CompanyActions";
import { OnCompanyUpdateSuccess } from "../../SetCompanyDetailsDialog";
import { CompanyDetails } from "./Details";
import { EditCompanyButton } from "./EditCompany/Button";
import { CompanyRegisteredDetails } from "./RegisteredDetails";
import { CompanyAdmins } from "./Admins";
import { IncompleteProfileAlert } from "./IncompleteProfileAlert";
import { CompanyDocuments } from "./Documents";
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
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid item xs={12} lg={7} xl={8}>
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
        </Grid>
        <Grid item xs={12} lg={5} xl={4}>
          <CompanyRegisteredDetails
            company={company}
            mapsApiKey={mapsApiKey}
            onCompanyUpdateSuccess={onCompanyUpdateSuccess}
          />
        </Grid>
        <Grid item xs={12} lg={7} xl={8}>
          <CompanyAdmins
            admins={company.companyMembers.nodes.filter(
              ({ account }) => account.role === ROLES.COMPANY_ADMIN
            )}
          />
          <CompanyDocuments
            companyId={company.id}
            documents={company.companyDocuments}
            onCompanyDocumentsUpdate={() => {
              onCompanyUpdateSuccess(company);
            }}
          />
        </Grid>
        <Grid item xs={12} lg={5} xl={4}>
          <SupportContactCard
            contactDetailsCollection={contactDetailsCollection}
          />

          {company.certifications.length > 0 && (
            <CertificationsCard
              title={t("certificationsTitle")}
              certifications={company.certifications}
            />
          )}
        </Grid>
        <AccessControl dataModel="company" action="editOperations">
          <Grid item xs={12} lg={12} xl={12}>
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
