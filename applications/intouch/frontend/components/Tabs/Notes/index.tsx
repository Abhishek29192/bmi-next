import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Table } from "@bmi/components";
import { Button } from "@bmi/components";
import AccessControl from "../../../lib/permissions/AccessControl";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { NoContent } from "../../NoContent";
import styles from "./styles.module.scss";
import { AddNoteDialog } from "./AddNoteDialog";

type NoteItemProps = {
  body: string;
  author: string;
  createdAt: string;
};
const NoteItem = ({ body, author, createdAt }: NoteItemProps) => (
  <Table.Row data-testid="note-item">
    <Table.Cell>{body}</Table.Cell>
    <Table.Cell>{new Date(createdAt).toLocaleDateString()}</Table.Cell>
    <Table.Cell>{author}</Table.Cell>
  </Table.Row>
);

export type NoteTabProps = {
  accountId: number;
  project: GetProjectQuery["project"];
  notes: GetProjectQuery["project"]["notes"]["nodes"];
};

export const NoteTab = ({ accountId, project, notes }: NoteTabProps) => {
  const { t } = useTranslation("project-page");
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  return (
    <div className={styles.main}>
      <AccessControl
        dataModel="project"
        action="addNote"
        extraData={{ isArchived: project.hidden }}
      >
        <div className={styles.header}>
          <Button
            variant="outlined"
            onClick={() => setIsAddNoteDialogOpen(true)}
          >
            {t("noteTab.header")}
          </Button>
          <AddNoteDialog
            isOpen={isAddNoteDialogOpen}
            accountId={accountId}
            projectId={project.id}
            onCloseClick={() => setIsAddNoteDialogOpen(false)}
          />
        </div>
      </AccessControl>
      <div className={styles.body}>
        {!notes.length ? (
          <NoContent message={t("noteTab.noContent")} />
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{t("noteTab.table.note")}</Table.Cell>
                <Table.Cell>{t("noteTab.table.date")}</Table.Cell>
                <Table.Cell>{t("noteTab.table.author")}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {notes.map(({ id, body, senderName, createdAt }) => (
                <NoteItem
                  key={id}
                  body={body}
                  author={senderName}
                  createdAt={createdAt}
                />
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    </div>
  );
};
