import React from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import Grid from "@bmi/grid";
import { GetCompanyQuery } from "../../../../graphql/generated/operations";
import { SmallProfileCard } from "../../../Cards/SmallProfileCard";

export const CompanyAdmins = ({
  admins
}: {
  admins: GetCompanyQuery["company"]["companyMembers"]["nodes"];
}) => {
  const { t } = useTranslation("common");

  return (
    <Grid container spacing={3} alignItems="stretch">
      {admins.map(({ account }) => (
        <Grid item xs={12} md={6} key={account.id}>
          <SmallProfileCard
            name={[account.firstName, account.lastName].join(" ")}
            jobTitle={t(`roles.${account.role}`)}
            phoneNumber={account.phone}
            emailAddress={account.email}
            avatar={account.photo}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export const CompanyAdminsFragment = gql`
  fragment CompanyAdminsFragment on Company {
    companyMembers {
      nodes {
        account {
          role
          id
          firstName
          lastName
          role
          phone
          email
          photo
        }
      }
    }
  }
`;
