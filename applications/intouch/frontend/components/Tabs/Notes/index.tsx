import React from "react";
import Table from "@bmi/table";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Note } from "@bmi/intouch-api-types";
import styles from "./styles.module.scss";

type NoteItemProps = {
  body: string;
  createdAt: string;
};
const NoteItem = ({ body, createdAt }: NoteItemProps) => (
  <Table.Row data-testid="note-item">
    <Table.Cell>{body}</Table.Cell>
    <Table.Cell>{new Date(createdAt).toLocaleDateString()}</Table.Cell>
    <Table.Cell>
      <VisibilityIcon />
    </Table.Cell>
  </Table.Row>
);

export type NoteTabProps = {
  notes: Note[];
};

export const NoteTab = ({ notes }: NoteTabProps) => {
  return (
    notes && (
      <div className={styles.main}>
        <div className={styles.body}>
          <Table>
            <Table.Body>
              {(notes || []).map(({ id, body, createdAt }) => (
                <NoteItem key={id} body={body} createdAt={createdAt} />
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  );
};
