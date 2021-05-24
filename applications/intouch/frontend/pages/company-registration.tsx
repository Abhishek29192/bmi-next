import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMutation, gql } from "@apollo/client";
import TextField from "@bmi/text-field";
import Form from "@bmi/form";
import Grid from "@bmi/grid";
import GridStyles from "../styles/Grid.module.scss";
import { initializeApollo } from "../lib/apolloClient";
import { getAuth0Instance } from "../lib/auth0";

const UPDATE_COMPANY = gql`
  mutation updateCompany($input: UpdateCompanyInput!) {
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

const Company = ({ currentCompany }: any) => {
  // The company is created when we create the user in the db
  // through an sql procedure (create_account) here we just
  // need to update it with the new values
  const [createCompany] = useMutation(UPDATE_COMPANY, {
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
          patch: values,
          id: currentCompany
        }
      }
    });
  };

  //TODO move statis string to translatoins when working on this page

  return (
    <Form onSubmit={onSubmit} rightAlignButton>
      <Grid
        container
        spacing={3}
        justify="center"
        className={GridStyles.outerGrid}
      >
        <Grid item xs={10} lg={4} xl={5}>
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

export const getServerSideProps = async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ locale, ...ctx }) {
      const apolloClient = await initializeApollo(null, { ...ctx, locale });
      const {
        data: { currentCompany }
      } = await apolloClient.query({
        query: GET_CURRENT_COMPANY,
        variables: {}
      });

      return {
        props: {
          currentCompany,
          ...(await serverSideTranslations(locale, ["common"]))
        }
      };
    }
  })(ctx);
};

export default Company;
