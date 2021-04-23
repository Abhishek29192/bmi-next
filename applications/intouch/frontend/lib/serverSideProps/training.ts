import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import auth0 from "../auth0";
import { initializeApollo } from "../apolloClient";
import { TrainingsDocument } from "../../graphql/generated/hooks";

export default auth0.withPageAuthRequired({
  async getServerSideProps({ locale, ...ctx }) {
    const apolloClient = await initializeApollo(null, { ...ctx, locale });

    let trainingData = {};

    try {
      const { data } = await apolloClient.query({
        query: TrainingsDocument,
        variables: {}
      });
      trainingData = data;
    } catch (error) {
      trainingData = {
        error: {
          message: "Unauthorized"
        }
      };
    }

    return {
      props: {
        trainingData,
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
