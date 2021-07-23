import React from "react";
import Table from "@bmi/table";
import Button from "@bmi/button";
import { Account, Technology } from "@bmi/intouch-api-types";
import DeleteIcon from "@material-ui/icons/Delete";
import TeamMemberCertification from "./TeamMemberCertifications";
import styles from "./styles.module.scss";

export const TeamMemberItem = ({
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
    )
  );
};
