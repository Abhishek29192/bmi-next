import React, { FormEvent, useState } from "react";
import { useTranslation } from "next-i18next";
import { gql } from "@apollo/client";
import { Form, InputValue } from "@bmi-digital/components";
import { Dialog } from "@bmi-digital/components";
import { TextField } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import log from "../../../../lib/logger";
import {
  GetProjectDocument,
  useAddProjectNoteMutation
} from "../../../../graphql/generated/hooks";
import styles from "./styles.module.scss";

type AddNoteDialogProps = {
  isOpen: boolean;
  accountId: number;
  projectId: number;
  onCloseClick: () => any;
};

export const AddNoteDialog = ({
  isOpen,
  accountId,
  projectId,
  onCloseClick
}: AddNoteDialogProps) => {
  const { t } = useTranslation(["common", "project-page"]);
  const CHARACTER_LIMIT = 255;

  const [body, setBody] = useState<string>("");

  const [addProjectNote, { loading }] = useAddProjectNoteMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error creating the project note: ${error.toString()}`
      });
    },
    onCompleted: ({ createNote: { note } }) => {
      log({
        severity: "INFO",
        message: `Create note - id: ${note.id}`
      });
      onCloseClick && onCloseClick();
    },
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: {
          projectId: projectId
        }
      }
    ]
  });

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
    values: Record<string, InputValue>
  ) => {
    event.preventDefault();

    addProjectNote({
      variables: {
        input: {
          note: {
            projectId: projectId,
            authorId: accountId,
            ...values
          }
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onCloseClick={onCloseClick} className={styles.dialog}>
      <Dialog.Title hasUnderline>
        {t("project-page:noteTab.addNoteDialog.title")}
      </Dialog.Title>
      <Dialog.Content>
        <Form onSubmit={handleSubmit} rightAlignButton>
          <Typography variant="subtitle1" display="block">
            {t("project-page:noteTab.addNoteDialog.detailHeading")}
          </Typography>
          <Form.Row>
            <TextField
              name={"body"}
              isTextArea
              rows={6}
              fullWidth={true}
              fieldIsRequiredError={t("common:error_messages.required")}
              value={body}
              onChange={(value) => setBody(value)}
              inputProps={{
                maxLength: CHARACTER_LIMIT
              }}
              helperText={`${body.length}/${CHARACTER_LIMIT}`}
              isRequired
            />
          </Form.Row>
          <Form.ButtonWrapper>
            <Form.Button onClick={onCloseClick} variant="outlined">
              {t("project-page:noteTab.addNoteDialog.cancel")}
            </Form.Button>
            <Form.SubmitButton key="btn-send" disabled={loading}>
              {t("project-page:noteTab.addNoteDialog.send")}
            </Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export const ADD_PROJECT_NOTE = gql`
  mutation addProjectNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      note {
        id
      }
    }
  }
`;
