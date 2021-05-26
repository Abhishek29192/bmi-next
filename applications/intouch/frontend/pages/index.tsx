import React from "react";
import Button from "@bmi/button";
import Hero from "@bmi/hero";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getAuth0Instance } from "../lib/auth0";
import { Layout } from "../components/Layout";
import { withLogger } from "../lib/logger/withLogger";
import logger from "../lib/logger";

const Homepage = () => {
  logger({
    severity: "INFO",
    message: "Home page loaded"
  });

  return (
    <Layout title="JS Roofers">
      <Hero
        level={0}
        hasSpaceBottom
        autoPlayInterval={10000}
        heroes={[
          {
            title: "H1 First heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor nisl, nec vestibulum odio molestie tincidunt.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: (
              <Button label="Call to action button">
                Call to action button
              </Button>
            )
          },
          {
            title: "H1 Second heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: (
              <Button label="Call to action button">
                Call to action button
              </Button>
            )
          },
          {
            title: "H1 Third heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: (
              <Button label="Call to action button">
                Call to action button
              </Button>
            )
          }
        ]}
      />
    </Layout>
  );
};

export const getServerSideProps = withLogger(async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps({ req, res }) {
      const logger = req.logger("home-page");
      logger.info("log example");

      return {
        props: {
          ...(await serverSideTranslations(ctx.locale, [
            "common",
            "sidebar",
            "footer",
            "company-page"
          ]))
        }
      };
    }
  })(ctx);
});

export default withPageAuthRequired(Homepage);
