import { Button, Table } from "@bmi-digital/components";
import { ProjectMember, Technology } from "@bmi/intouch-api-types";
import CheckBox from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
import DeleteIcon from "@material-ui/icons/Delete";
import classnames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import AccessControl from "../../../lib/permissions/AccessControl";
import styles from "./styles.module.scss";
import TeamMemberCertification from "./TeamMemberCertifications";

type TeamMemberItemProps = {
  project: GetProjectQuery["project"];
  member: ProjectMember;
  loading: boolean;
  onDeleteClick?: () => void;
  canNominateProjectResponsible?: boolean;
  isSomeResponsibleInstaller?: boolean;
  onResponsibleInstallerChange?: () => void;
};

export const TeamMemberItem = ({
  project,
  member,
  onDeleteClick,
  canNominateProjectResponsible,
  isSomeResponsibleInstaller,
  onResponsibleInstallerChange,
  loading
}: TeamMemberItemProps) => {
  const { account, isResponsibleInstaller } = member;
  const [deletingId, setDeletingId] = useState(null);
  const { t } = useTranslation("common");

  const onInternalDelete = (id) => {
    setDeletingId(id);
    onDeleteClick();
  };

  return (
    <Table.Row
      data-testid="team-item"
      className={classnames(styles["responsible"], {
        [styles["responsible--selected"]]: isResponsibleInstaller
      })}
    >
      {(isSomeResponsibleInstaller || canNominateProjectResponsible) && (
        <Table.Cell>
          <ResponsibleInstaller
            canNominateProjectResponsible={canNominateProjectResponsible}
            isResponsibleInstaller={isResponsibleInstaller}
            onResponsibleInstallerChange={onResponsibleInstallerChange}
          />
        </Table.Cell>
      )}
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
      <AccessControl
        dataModel="project"
        action="removeTeamMember"
        extraData={{ isArchived: project.hidden }}
      >
        <Table.Cell>
          <Button
            key={`delete-btn-member-${member.accountId}`}
            data-testid="team-member-delete"
            variant="text"
            isIconButton
            onClick={() => onInternalDelete(member.accountId)}
            disabled={deletingId === member.accountId && loading}
            className={styles.deleteButton}
          >
            <DeleteIcon color="primary" />
          </Button>
        </Table.Cell>
      </AccessControl>
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
  SELECTED_RESPONSIBLE: <CheckBox style={{ color: "green" }} />,
  ADD_RESPONSIBLE: <CheckBoxOutlineBlank color="action" />,
  REMOVE_RESPONSIBLE: <CheckBox style={{ color: "green" }} />
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
