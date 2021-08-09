import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { GetUserProfileQuery } from "../../../graphql/generated/operations";
import { findAccountCompanyFromAccountQuery } from "../../../lib/account";
import { TableContainer } from "../../../components/TableContainer";
import { CompanyDetails } from "../Company/Details";
import RegisterCompanyCard from "../../Cards/RegisterCompanyCard";
import { UserProfileCard } from "./ProfileCard";
import { UserCertifications } from "./UserCertifications";
import styles from "./styles.module.scss";
import { LeaveCompanyButton } from "./LeaveCompanyButton";

type UserProfilePageContentProps = {
  accountSSR: GetUserProfileQuery["account"];
};

export const UserProfilePageContent = ({
  accountSSR
}: UserProfilePageContentProps) => {
  const { t } = useTranslation(["profile", "company-page"]);

  const [account, setAccount] = useState(accountSSR);

  const currentCompany = findAccountCompanyFromAccountQuery(account);

  return (
    <div className={styles.contentContainer}>
      <div>
        <TableContainer title={t("profile:profileCard.certificationsHeading")}>
          <UserCertifications
            certifications={account.certificationsByDoceboUserId.nodes}
          />
        </TableContainer>

        {currentCompany ? (
          <div className={styles.companyDetailsContainer}>
            <CompanyDetails
              company={currentCompany}
              actions={
                <div className={styles.leaveButtonContainer}>
                  <LeaveCompanyButton
                    onLeaveCurrentCompanySuccess={setAccount}
                  />
                </div>
              }
              showName
              showBusinessType={false}
              showAboutUs={false}
              showCompanyOwner={false}
            />
          </div>
        ) : (
          <RegisterCompanyCard />
        )}
      </div>

      <UserProfileCard account={account} onProfileUpdateSuccess={setAccount} />
    </div>
  );
};
