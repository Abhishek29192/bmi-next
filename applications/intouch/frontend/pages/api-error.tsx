import React from "react";
import { Grid } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import { Session } from "@auth0/nextjs-auth0";
import { Account } from "@bmi/intouch-api-types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import GridStyles from "../styles/Grid.module.scss";
import { Layout } from "../components/Layout/Unauthenticated";
import { getAuth0Instance } from "../lib/auth0";
import { withPage } from "../lib/middleware/withPage";
import { withPublicPage } from "../lib/middleware/withPublicPage";
import {
  generatePageError,
  ErrorStatusCode,
  withPageError
} from "../lib/error";

type Props = {
  message: string;
  account: Account;
};

const errors = {
  errorInvitationNotFound: {
    title: "errorInvitationNotFound",
    statusCode: 404
  },
  errorUserBlocked: {
    title: "errorUserBlocked",
    statusCode: 401
  },
  errorAuthentication: {
    title: "errorAuthentication",
    statusCode: 401
  }
};

const ErrorPageApi = ({ message }: Props) => {
  const { t } = useTranslation("error-page");

  return (
    <Layout title="Error" isError={true}>
      <Grid
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <Typography component="h1" variant="h1">
            {t(message)}
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const auth0 = await getAuth0Instance(context.req, context.res);
  const session: Session = auth0.getSession(context.req, context.res);

  // Only if we're requesting for a public page AND we're not logged in (no session) can we use the public middleware.
  // otherwise normal middleware.
  const middleware = !session ? withPublicPage : withPage;

  const translations = await serverSideTranslations(context.locale, [
    "error-page",
    "sidebar",
    "common",
    "footer"
  ]);

  // account and globalPageData are only available in withPage middleware
  return await middleware(async ({ globalPageData, res, account }) => {
    if (!account) {
      return {
        props: {
          message: context.query.message,
          ...translations
        }
      };
    }

    const statusCode = ErrorStatusCode.INTERNAL_SERVER_ERROR;
    res.statusCode = errors[context.query.message].statusCode || statusCode;
    return generatePageError(
      res.statusCode,
      {},
      {
        globalPageData,
        title: context.query.message,
        ...translations
      }
    );
  })(context);
};

export default withPageError(ErrorPageApi);
