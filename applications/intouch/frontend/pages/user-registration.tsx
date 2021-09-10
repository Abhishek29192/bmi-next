import React from "react";
import BmiThemeProvider from "@bmi/theme-provider";
import { useTranslation } from "next-i18next";
import { Account } from "@bmi/intouch-api-types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import TextField from "@bmi/text-field";
import Dialog from "@bmi/dialog";
import Form from "@bmi/form";
import { useUpdateAccountMutation } from "../graphql/generated/hooks";
import { withPage } from "../lib/middleware/withPage";

const fields = ["firstName", "lastName"];

type Props = {
  account: Account;
};

const UserRegistration = ({ account }: Props) => {
  const { t } = useTranslation("user-registration");

  const [updateAccount] = useUpdateAccountMutation({
    onCompleted: () => {
      window.location.assign("/");
    }
  });
  const onSubmit = (event, values) => {
    event.preventDefault();
    updateAccount({
      variables: {
        input: {
          id: account.id,
          patch: {
            firstName: values.firstName,
            lastName: values.lastName
          }
        }
      }
    });
  };

  return (
    <BmiThemeProvider>
      <Dialog open={true} data-testid="dialog">
        <Dialog.Title hasUnderline>{t("dialog.title")}</Dialog.Title>
        <Dialog.Content>
          <Form onSubmit={onSubmit} rightAlignButton>
            <Form.Row>
              {fields.map((field) => (
                <TextField
                  key={field}
                  name={field}
                  defaultValue={account[`${field}`]}
                  variant="outlined"
                  label={t(`dialog.form.${field}`)}
                  margin="normal"
                  isRequired
                  fullWidth
                />
              ))}
            </Form.Row>
            <Form.ButtonWrapper>
              <Form.SubmitButton>{t("save")}</Form.SubmitButton>
            </Form.ButtonWrapper>
          </Form>
        </Dialog.Content>
      </Dialog>
    </BmiThemeProvider>
  );
};

export const getServerSideProps = withPage(async ({ locale, account }) => {
  return {
    props: {
      account,
      ...(await serverSideTranslations(locale, ["common", "user-registration"]))
    }
  };
});

export default withPageAuthRequired(UserRegistration);
