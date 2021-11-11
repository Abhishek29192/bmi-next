import React from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import { gql } from "@apollo/client";
import { exportCsv } from "../../../lib/utils/report";
import { useGetTeamsReportLazyQuery } from "../../../graphql/generated/hooks";
import { GetTeamsReportQuery } from "../../../graphql/generated/operations";
import styles from "./styles.module.scss";

const getReportData = (teams: GetTeamsReportQuery["accounts"]) => {
  return [...teams.nodes].map((team) => {
    const { __typename, photo, ...rest } = team;
    return rest;
  });
};

const TeamReport = () => {
  const { t } = useTranslation("team-page");
  const [getReport] = useGetTeamsReportLazyQuery({
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
  query GetTeamsReport {
    accounts {
      nodes {
        id
        email
        phone
        firstName
        lastName
        role
        status
        created
        doceboUserId
        doceboUsername
        photo
        signedPhotoUrl
        migrationId
        migratedToAuth0
      }
    }
  }
`;
