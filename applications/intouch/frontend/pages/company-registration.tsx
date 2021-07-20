import React from "react";
import { useTranslation } from "next-i18next";
import BmiThemeProvider from "@bmi/theme-provider";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMutation, gql } from "@apollo/client";
import TextField from "@bmi/text-field";
import Form from "@bmi/form";
import Dialog from "@bmi/dialog";
import { withPage } from "../lib/middleware/withPage";

const CREATE_COMPANY = gql`
  mutation createCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      company {
        name
      }
    }
  }
`;

const GET_CURRENT_COMPANY = gql`
  query currentCompany {
    currentCompany
  }
`;

const fields = ["name"];

const Company = ({ currentCompany }: any) => {
  const { t } = useTranslation("complete-registration");

  // The company is created when we create the user in the db
  // through an sql procedure (create_account) here we just
  // need to update it with the new values
  const [createCompany] = useMutation(CREATE_COMPANY, {
    onCompleted: () => {
      // Redirect to silent-login in order to re-create the session as we need to remove
      // the claim from the jwt token to stop showing the registration page to the user
      window.location.assign("/api/silent-login?returnTo=/");
    }
  });

  const onSubmit = (event, values) => {
    event.preventDefault();
    createCompany({
      variables: {
        input: {
          patch: {
            ...values,
            status: "ACTIVE"
          },
          id: currentCompany
        }
      }
    });
  };

  return (
    <BmiThemeProvider>
      <Dialog open={true} data-testid="dialog">
        <Dialog.Title hasUnderline>{t("company.title")}</Dialog.Title>
        <Dialog.Content>
          <Form onSubmit={onSubmit} rightAlignButton>
            <Form.Row>
              {fields.map((field) => (
                <TextField
                  key={field}
                  name={field}
                  variant="outlined"
                  label={t(`company.${field}`)}
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

export const getServerSideProps = withPage(async ({ apolloClient, locale }) => {
  const {
    data: { currentCompany }
  } = await apolloClient.query({
    query: GET_CURRENT_COMPANY,
    variables: {}
  });

  return {
    props: {
      currentCompany,
      ...(await serverSideTranslations(locale, [
        "common",
        "complete-registration"
      ]))
    }
  };
});

export default withPageAuthRequired(Company);
