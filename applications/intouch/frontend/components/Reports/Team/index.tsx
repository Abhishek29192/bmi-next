import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi-digital/components/button";
import { gql } from "@apollo/client";
import { exportCsv } from "../../../lib/utils/report";
import { useGetTeamsReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetTeamsReportQuery } from "../../../graphql/generated/operations";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import styles from "./styles.module.scss";

const getDataFromCompanyMember = ({
  nodes
}: GetTeamsReportQuery["accounts"]["nodes"][0]["companyMembers"]) => {
  return nodes.length ? nodes[0].company : undefined;
};

const getReportData = (teams: GetTeamsReportQuery["accounts"]) => {
  return [...teams.nodes].map((team) => {
    const { __typename, photo, companyMembers, ...rest } = team;
    const companyData = {
      ...getDataFromCompanyMember(companyMembers)
    };
    return {
      ...rest,
      companyName: companyData.name || null,
      companyTier: companyData.tier || null
    };
  });
};

const TeamReport = ({ disabled }: ReportProps) => {
  const { t } = useTranslation("team-page");
  const { market } = useMarketContext();
  const [getReport] = useGetTeamsReportLazyQuery({
    variables: {
      marketId: market.id
    },
    onCompleted: ({ accounts }) => {
      const data = getReportData(accounts);
      exportCsv(data, {
        filename: `teams-${Date.now()}`,
        title: "Team"
      });
    }
  });

  return (
    <div>
      <Button
        variant="outlined"
        data-testid="export-button"
        disabled={disabled}
        onClick={getReport}
        className={styles.sidePanelFooterButton}
      >
        {t("report")}
      </Button>
    </div>
  );
};

export default TeamReport;

export const GET_TEAMS_REPORT = gql`
  query GetTeamsReport($marketId: Int!) {
    accounts(condition: { marketId: $marketId }) {
      nodes {
        id
        email
        phone
        firstName
        lastName
        role
        status
        doceboUserId
        doceboUsername
        photo
        signedPhotoUrl
        migrationId
        migratedToAuth0
        createdAt
        updatedAt
        companyMembers {
          nodes {
            company {
              name
              tier
            }
          }
        }
      }
    }
  }
`;
