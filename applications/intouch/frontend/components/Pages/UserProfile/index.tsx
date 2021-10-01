import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { GetUserProfileQuery } from "../../../graphql/generated/operations";
import { findAccountCompanyFromAccountQuery } from "../../../lib/account";
import { TableContainer } from "../../../components/TableContainer";
import { CompanyDetails } from "../Company/Details";
import { RegisterCompanyCard } from "./RegisterCompany/Card";
import { UserProfileCard } from "./ProfileCard";
import { UserCertifications } from "./UserCertifications";
import { UserContactCard } from "./UserContactCard";
import styles from "./styles.module.scss";
import { LeaveCompanyButton } from "./LeaveCompanyButton";

type UserProfilePageContentProps = {
  accountSSR: GetUserProfileQuery["account"];
  contactUsPage?: { href: string; label: string };
};

export const UserProfilePageContent = ({
  accountSSR,
  contactUsPage
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
                account.role === "INSTALLER" ? (
                  <div className={styles.leaveButtonContainer}>
                    <LeaveCompanyButton
                      onLeaveCurrentCompanySuccess={setAccount}
                    />
                  </div>
                ) : null
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
      <div>
        <UserProfileCard
          account={account}
          onProfileUpdateSuccess={setAccount}
        />
        {contactUsPage ? (
          <UserContactCard
            href={contactUsPage.href}
            label={contactUsPage.label}
          />
        ) : null}
      </div>
    </div>
  );
};
