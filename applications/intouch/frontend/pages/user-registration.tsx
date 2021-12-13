import React, { useState } from "react";
import Link from "next/link";
import BmiThemeProvider from "@bmi/theme-provider";
import { useTranslation } from "next-i18next";
import { Account } from "@bmi/intouch-api-types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import TextField from "@bmi/text-field";
import Checkbox from "@bmi/checkbox";
import Dialog from "@bmi/dialog";
import Form from "@bmi/form";
import { useUpdateAccountMutation } from "../graphql/generated/hooks";
import { withPage } from "../lib/middleware/withPage";
import { getMarketAndEnvFromReq } from "../lib/utils";

const fields = ["firstName", "lastName"];

type Props = {
  account: Account;
  termsToAccept: Boolean;
  baseUrl: string;
};

const UserRegistration = ({ account, termsToAccept, baseUrl }: Props) => {
  const { t } = useTranslation("user-registration");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [updateAccount] = useUpdateAccountMutation({
    onCompleted: () => {
      // I've updated a value in Auth0 so I need to re-create the token
      window.location.assign("/api/silent-login");
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
            lastName: values.lastName,
            ...(termsAccepted && { termsCondition: termsAccepted })
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
              {termsToAccept && (
                <Checkbox
                  name="terms-condition"
                  onChange={(checked) => setTermsAccepted(checked)}
                  label={
                    <>
                      {t("dialog.form.agree_label")}
                      <Link href={`//${baseUrl}/terms`}>
                        <a style={{ textDecoration: "underline" }}>
                          {t("dialog.form.terms_condition")}
                        </a>
                      </Link>
                      {` ${t("dialog.form.and")} `}
                      <Link href={`//${baseUrl}/privacy`}>
                        <a style={{ textDecoration: "underline" }}>
                          {t("dialog.form.privacy_policy")}
                        </a>
                      </Link>
                    </>
                  }
                  required
                />
              )}
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

export const getServerSideProps = withPage(
  async ({ locale, account, session, req }) => {
    const { AUTH0_NAMESPACE } = process.env;

    const termsToAccept =
      session.user[`${AUTH0_NAMESPACE}/terms_to_accept`] || false;

    const { currentHost } = getMarketAndEnvFromReq(req);

    return {
      props: {
        account,
        termsToAccept,
        baseUrl: currentHost,
        ...(await serverSideTranslations(locale, [
          "common",
          "user-registration"
        ]))
      }
    };
  }
);

export default withPageAuthRequired(UserRegistration);
