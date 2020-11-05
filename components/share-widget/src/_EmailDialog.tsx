import Checkbox from "@bmi/checkbox";
import Dialog from "@bmi/dialog";
import Form from "@bmi/form";
import { InputValue } from "@bmi/form/src/withFormControl";
import TextField from "@bmi/text-field";
import React, { Dispatch, FormEvent, SetStateAction } from "react";
import styles from "./EmailDialog.module.scss";

type Props = {
  title?: string;
  children?: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const EmailDialog = ({
  title = "Take this information with you",
  children,
  open,
  setOpen
}: Props) => {
  const handleOnSubmit = (
    _: FormEvent<HTMLFormElement>,
    { email, message, name }: Record<string, InputValue>
  ) => {
    const br = "%0D%0A";
    setOpen(false);
    // @todo: Do we want to use an actual email service here?
    window.open(
      `mailto:${email}?subject=BMI&body=${message}${br}${br}${name}${br}${br}${location.href}`
    );
  };

  const validateEmail = (value: string) =>
    value.includes("@") ? false : "Email addresses must have an '@'";

  return (
    <Dialog
      open={open}
      onCloseClick={() => setOpen(false)}
      className={styles["EmailDialog"]}
      color="alabaster"
    >
      <Dialog.Title hasUnderline>{title}</Dialog.Title>
      <Dialog.Content>
        {children}
        {/* @ts-ignore */}
        <Form onSubmit={handleOnSubmit} rightAlignButton>
          <TextField
            name="email"
            isRequired
            variant="outlined"
            label="Recipient's email address"
            className={styles["input"]}
            getValidationError={validateEmail}
            fullWidth
          />
          <TextField
            name="name"
            isRequired
            label="Your name"
            variant="outlined"
            className={styles["input"]}
            fullWidth
          />
          <TextField
            isTextArea
            name="message"
            label="Your message (optional)"
            variant="outlined"
            className={styles["input"]}
            rows="6"
            fullWidth
          />
          <Checkbox
            name="terms-privacy"
            className={styles["input"]}
            isRequired
            label="By submitting this form I aggree to the terms of BMI's website
              terms of use and privacy policy"
          />
          <Form.ButtonWrapper>
            <Form.Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Form.Button>
            <Form.SubmitButton>Send to email</Form.SubmitButton>
          </Form.ButtonWrapper>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

export default EmailDialog;
