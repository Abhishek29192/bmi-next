import React from "react";
import { useTranslation } from "next-i18next";
import Table from "@bmi/table";
import Button from "@bmi/button";
import { ProjectMember, Technology } from "@bmi/intouch-api-types";
import DeleteIcon from "@material-ui/icons/Delete";
import Check from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";
import classnames from "classnames";
import TeamMemberCertification from "./TeamMemberCertifications";
import styles from "./styles.module.scss";

type TeamMemberItemProps = {
  member: ProjectMember;
  onDeleteClick?: () => void;
  canNominateProjectResponsible?: boolean;
  onResponsibleInstallerChange?: () => void;
};

export const TeamMemberItem = ({
  member,
  onDeleteClick,
  canNominateProjectResponsible,
  onResponsibleInstallerChange
}: TeamMemberItemProps) => {
  const { account, isResponsibleInstaller } = member;
  const { t } = useTranslation("common");
  return (
    <Table.Row
      data-testid="team-item"
      className={classnames(styles["responsible"], {
        [styles["responsible--selected"]]: isResponsibleInstaller
      })}
    >
      <Table.Cell>
        <ResponsibleInstaller
          canNominateProjectResponsible={canNominateProjectResponsible}
          isResponsibleInstaller={isResponsibleInstaller}
          onResponsibleInstallerChange={onResponsibleInstallerChange}
        />
      </Table.Cell>
      <Table.Cell>
        {account.firstName} {account.lastName}
      </Table.Cell>
      <Table.Cell className={styles.role}>
        {t(`roles.${account.role}`)}
      </Table.Cell>
      <Table.Cell data-testid="team-item-certification">
        <TeamMemberCertification
          certifications={Array.from(
            new Set(
              (account.certificationsByDoceboUserId?.nodes || []).map(
                (item) => item.technology as Technology
              )
            )
          )}
        />
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
  );
};

type ProjectMemberResponsibleAction =
  | "NONE_RESPONSIBLE"
  | "SELECTED_RESPONSIBLE"
  | "ADD_RESPONSIBLE"
  | "REMOVE_RESPONSIBLE";

const responsibleStatusIcons: Record<
  ProjectMemberResponsibleAction,
  React.ReactElement | null
> = {
  NONE_RESPONSIBLE: null,
  SELECTED_RESPONSIBLE: <Check style={{ color: "green" }} />,
  ADD_RESPONSIBLE: <AddIcon color="action" />,
  REMOVE_RESPONSIBLE: <Check style={{ color: "green" }} />
};

const ResponsibleInstaller = ({
  canNominateProjectResponsible,
  isResponsibleInstaller,
  onResponsibleInstallerChange
}: {
  canNominateProjectResponsible: boolean;
  isResponsibleInstaller: boolean;
  onResponsibleInstallerChange?: () => void;
}) => {
  if (canNominateProjectResponsible) {
    return (
      <Button
        data-testid="team-member-update-responsible"
        variant="text"
        isIconButton
        onClick={onResponsibleInstallerChange}
      >
        {
          responsibleStatusIcons[
            isResponsibleInstaller ? "REMOVE_RESPONSIBLE" : "ADD_RESPONSIBLE"
          ]
        }
      </Button>
    );
  }

  return responsibleStatusIcons[
    isResponsibleInstaller ? "SELECTED_RESPONSIBLE" : "NONE_RESPONSIBLE"
  ];
};
