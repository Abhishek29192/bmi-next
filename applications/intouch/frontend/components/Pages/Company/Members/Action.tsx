import React from "react";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { AccountStatus } from "@bmi/intouch-api-types";
import { TeamMembersQuery } from "../../../../graphql/generated/operations";
import { SimpleCard } from "../../../Cards/SimpleCard";

export type CompanyMemberActionCardProps = {
  member: TeamMembersQuery["accounts"]["nodes"][0];
  onAccountUpdate?: (id: number, status: AccountStatus) => void;
  disabled?: boolean;
};
const CompanyMemberActionCard = ({
  member,
  onAccountUpdate,
  disabled
}: CompanyMemberActionCardProps) => {
  const { id, status } = member;
  const { t } = useTranslation("team-page");

  const toggleCompanyMemberAction = () => {
    const updatedStatus = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    onAccountUpdate(id, updatedStatus);
  };
  return (
    <SimpleCard>
      <Typography variant="h5">{t("userActions.title")}</Typography>
      <div style={{ textAlign: "right" }}>
        <Button onClick={toggleCompanyMemberAction} disabled={disabled}>
          {status === "ACTIVE"
            ? t("userActions.action.deactivate")
            : t("userActions.action.activate")}
        </Button>
      </div>
    </SimpleCard>
  );
};
export default CompanyMemberActionCard;
