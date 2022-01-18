import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { gql } from "@apollo/client";
import { exportCsv } from "../../../lib/utils/report";
import { useGetTeamsReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetTeamsReportQuery } from "../../../graphql/generated/operations";
import { useMarketContext } from "../../../context/MarketContext";
import { ReportProps } from "../types";
import styles from "./styles.module.scss";

const getReportData = (teams: GetTeamsReportQuery["accounts"]) => {
  return [...teams.nodes].map((team) => {
    const { __typename, photo, ...rest } = team;
    return rest;
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
      }
    }
  }
`;
