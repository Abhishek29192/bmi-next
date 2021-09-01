import React from "react";
import { useTranslation } from "react-i18next";
import Grid from "@bmi/grid";
import { GetCompanyQuery } from "../../../graphql/generated/operations";
import { GlobalPageProps } from "../../../lib/middleware/withPage";
import { ROLES } from "../../../lib/constants";
import { validateCompanyProfile } from "../../../lib/validations/company";
import GridStyles from "../../../styles/Grid.module.scss";
import { SupportContactCard } from "../../Cards/SupportContactCard";
import { CertificationsCard } from "../../Cards/Certifications";
import { OnCompanyUpdateSuccess } from "../../SetCompanyDetailsDialog";
import { CompanyDetails } from "./Details";
import { EditCompanyButton } from "./EditCompany/Button";
import { CompanyRegisteredDetails } from "./RegisteredDetails";
import { CompanyAdmins } from "./Admins";
import { IncompleteProfileAlert } from "./IncompleteProfileAlert";

type Props = GlobalPageProps & {
  company: GetCompanyQuery["company"];
  contactDetailsCollection: GetCompanyQuery["contactDetailsCollection"];
  onCompanyUpdateSuccess: OnCompanyUpdateSuccess;
};

export const CompanyPage = ({
  company,
  contactDetailsCollection,
  onCompanyUpdateSuccess
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
                onCompanyUpdateSuccess={onCompanyUpdateSuccess}
              />
            }
          />
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <CompanyRegisteredDetails
            company={company}
            onCompanyUpdateSuccess={onCompanyUpdateSuccess}
          />
        </Grid>

        <Grid item xs={12} lg={7} xl={8}>
          <CompanyAdmins
            admins={company.companyMembers.nodes.filter(
              ({ account }) => account.role === ROLES.COMPANY_ADMIN
            )}
          />
        </Grid>

        <Grid item xs={12} lg={5} xl={4}>
          <SupportContactCard
            contactDetailsCollection={contactDetailsCollection}
          />

          {company.certifications.length > 0 && (
            <CertificationsCard
              title={t("BMI Certifications")}
              certifications={company.certifications}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};
