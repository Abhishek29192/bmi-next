import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMutation, gql } from "@apollo/client";
import TextField from "@bmi/text-field";
import Form from "@bmi/form";
import Grid from "@bmi/grid";
import auth0 from "../lib/auth0";
import GridStyles from "../styles/Grid.module.scss";

const CREATE_COMPANY = gql`
  mutation($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      company {
        name
      }
    }
  }
`;

const Company = () => {
  const [createCompany] = useMutation(CREATE_COMPANY, {
    onCompleted: () => window.location.assign("/")
  });

  const onSubmit = (event, values) => {
    event.preventDefault();
    createCompany({
      variables: {
        input: {
          company: values
        }
      }
    });
  };

  return (
    <Form onSubmit={onSubmit} rightAlignButton>
      <Grid
        container
        spacing={3}
        justify="center"
        className={GridStyles.outerGrid}
      >
        <Grid item xs={12} lg={4} xl={5}>
          <Form.Row>
            <TextField
              name="name"
              isRequired
              variant="outlined"
              label="Company Name"
              fullWidth
              margin="normal"
            />
          </Form.Row>
          <Form.ButtonWrapper>
            <Form.SubmitButton>Save</Form.SubmitButton>
          </Form.ButtonWrapper>
        </Grid>
      </Grid>
    </Form>
  );
};

export const getServerSideProps = auth0.withPageAuthRequired({
  async getServerSideProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"]))
      }
    };
  }
});

export default Company;
