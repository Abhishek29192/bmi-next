import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Session } from "@auth0/nextjs-auth0";
import auth0 from "../auth0";
import { initializeApollo } from "../apolloClient";
import { TrainingsDocument } from "../../graphql/generated/hooks";

export default auth0.withPageAuthRequired({
  async getServerSideProps({ locale, req, res }) {
    const apolloClient = initializeApollo();
    const { accessToken }: Session = await auth0.getSession(req, res);

    const { data } = await apolloClient.query({
      query: TrainingsDocument,
      variables: {},
      context: { headers: { Authorization: `Bearer ${accessToken}` } }
    });

    return {
      props: {
        trainingData: data,
        ...(await serverSideTranslations(locale, [
          "common",
          "sidebar",
          "footer",
          "company-page"
        ]))
      }
    };
  }
});
