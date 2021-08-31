import React from "react";
import { useTranslation } from "next-i18next";
import Table from "@bmi/table";
import Button from "@bmi/button";
import { Note } from "@bmi/intouch-api-types";
import styles from "./styles.module.scss";

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
  notes: Note[];
};

export const NoteTab = ({ notes }: NoteTabProps) => {
  const { t } = useTranslation("project-page");
  return (
    notes.length > 0 && (
      <div className={styles.main}>
        <div className={styles.header}>
          <Button variant="outlined">{t("noteTab.header")}</Button>
        </div>
        <div className={styles.body}>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>{t("noteTab.table.note")}</Table.Cell>
                <Table.Cell>{t("noteTab.table.date")}</Table.Cell>
                <Table.Cell>{t("noteTab.table.author")}</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {(notes || []).map(({ id, body, author, createdAt }) => (
                <NoteItem
                  key={id}
                  body={body}
                  author={[author?.firstName, author?.lastName]
                    .filter(Boolean)
                    .join(" ")}
                  createdAt={createdAt}
                />
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  );
};
