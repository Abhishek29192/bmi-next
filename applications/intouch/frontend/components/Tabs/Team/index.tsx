import React, { useEffect, useState } from "react";
import Table from "@bmi/table";
import Button from "@bmi/button";
import { useTranslation } from "next-i18next";
import { ProjectMember, Account, Technology } from "@bmi/intouch-api-types";
import {
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof
} from "@bmi/icon";
import DeleteIcon from "@material-ui/icons/Delete";
import { SvgIcon } from "@material-ui/core";

import styles from "./styles.module.scss";

const CERTIFICATION_ICONS: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: CertificationPitchedRoof,
  PITCHED: CertificationFlatRoof,
  OTHER: CertificationOtherTraining
};

const TeamItem = ({
  account,
  onDeleteClick
}: {
  account: Account;
  onDeleteClick: () => void;
}) => {
  return (
    account && (
      <Table.Row data-testid="team-item">
        <Table.Cell>&nbsp;</Table.Cell>
        <Table.Cell>
          {account.firstName} {account.lastName}
        </Table.Cell>
        <Table.Cell className={styles.role}>
          {account.role?.replace("_", " ")?.toLowerCase()}
        </Table.Cell>
        <Table.Cell data-testid="team-item-certification">
          {Array.from(
            new Set(
              (account.certificationsByDoceboUserId?.nodes || []).map(
                (item) => item.technology
              )
            )
          ).map((technology, index) => (
            <SvgIcon
              key={`${account.id}-${index}-${technology}`}
              viewBox="0 0 48 48"
              component={CERTIFICATION_ICONS[technology as Technology]}
              data-testid={`icon-${technology}`}
            />
          ))}
        </Table.Cell>
        <Table.Cell>
          <Button
            data-testid="team-member-delete"
            variant="text"
            isIconButton
            onClick={onDeleteClick}
          >
            <DeleteIcon color="primary" />
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  );
};

export type TeamTabProps = {
  teams: ProjectMember[];
};

export const TeamTab = ({ teams }: TeamTabProps) => {
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const { t } = useTranslation("common");

  useEffect(() => {
    setProjectMembers(teams);
  }, [teams]);

  const onDeleteClickHandler = (projectMemberId: number) => {
    setProjectMembers((members) =>
      members.filter((member) => member.id !== projectMemberId)
    );
    //TODO:Delete from DB using mutation
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button variant="outlined">{t("Add team member")}</Button>
      </div>
      <div className={styles.body}>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>{t("Responsible Installer")}</Table.Cell>
              <Table.Cell>{t("Team Member")}</Table.Cell>
              <Table.Cell>{t("Role")}</Table.Cell>
              <Table.Cell>{t("Certification")}</Table.Cell>
              <Table.Cell>{t("Remove")}</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {projectMembers.map(
              (team, index) =>
                team.account && (
                  <TeamItem
                    key={`${team.id}-${index}`}
                    account={team.account}
                    onDeleteClick={() => {
                      onDeleteClickHandler(team.id);
                    }}
                  />
                )
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
