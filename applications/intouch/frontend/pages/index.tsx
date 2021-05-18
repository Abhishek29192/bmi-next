import React from "react";
import Hero from "@bmi/hero";
import { getAuth0Instance } from "../lib/auth0";
import { Layout } from "../components/Layout";
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
            cta: {
              label: "Call to Action Button"
            }
          },
          {
            title: "H1 Second heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: {
              label: "Call to Action Button"
            }
          },
          {
            title: "H1 Third heading dark background",
            children:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
            imageSource: "https://source.unsplash.com/random/1200x1200",
            cta: {
              label: "Call to Action Button"
            }
          }
        ]}
      />
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  const auth0 = await getAuth0Instance(ctx.req, ctx.res);
  return auth0.withPageAuthRequired({
    async getServerSideProps(ctx) {
      return { props: {} };
    }
  })(ctx);
};

export default Homepage;
