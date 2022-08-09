import { Button, Grid, Hero, Typography } from "@bmi/components";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import { Link } from "gatsby";
import {
  parse as queryString,
  stringify as stringifyQueryString
} from "query-string";
import React from "react";
import Container from "../components/Container";
import DescriptionCard from "../components/DescriptionCard";
import OptionCard from "../components/OptionCard";
import Page from "../components/Page";
import pageStyles from "../components/Page.module.scss";
import landing from "../images/landing.jpg";

const VALUES_PARAM = "v";

const getLink = (page: string, values: Record<string, unknown>): string => {
  const currentQueryParams =
    typeof window === "undefined" ? {} : queryString(window.location.search);
  const encoded = stringifyQueryString({
    ...currentQueryParams,
    [VALUES_PARAM]: encodeURIComponent(JSON.stringify(values)) // encode `"` to avoid Azure 403 error.
  });

  return page + "?" + encoded;
};

const Home = () => (
  <Page title="Bituman Flat Roof Estimator">
    <Hero
      title="Bitumen Flat Roof Estimator"
      level={1}
      media={<img src={landing} alt="Bitumen Flat Roof Estimator" />}
      className={pageStyles.Hero}
    >
      Use this estimating tool to identify the best flat roof system for your
      project and calculate the product quantities that you&apos;ll need to
      complete it.
    </Hero>
    <Container>
      <Typography variant="h3" style={{ marginTop: 96, marginBottom: 36 }}>
        Please select a product type to begin
      </Typography>
      <OptionCard
        title={"SBS Bitumen"}
        description={
          "BMI Icopal SBS Bitumen Systems are suitable for new build and refurbishment projects, they are available in a variety of colours finishes and offer 15 and 20 year guarantee options."
        }
      >
        <Grid item>
          <Link
            to={getLink("sbs", { guarantee: "20" })}
            className={pageStyles.link}
          >
            <Button>20 Year System</Button>
          </Link>
        </Grid>
        <Grid item>
          <Link
            to={getLink("sbs", { guarantee: "15" })}
            className={pageStyles.link}
          >
            <Button>15 Year System</Button>
          </Link>
        </Grid>
      </OptionCard>
      <OptionCard
        title={"APP Bitumen"}
        description={
          "BMI Icopal APP Bitumen systems come in two colour finishes and offer a 15 year guarantee."
        }
      >
        <Link
          to={getLink("app", { guarantee: "15" })}
          className={pageStyles.link}
        >
          <Button>15 Year System</Button>
        </Link>
      </OptionCard>
      <div>
        <DescriptionCard
          icon={HelpOutlineIcon}
          title={"SBS and APP - the differences explained"}
        >
          <b>SBS bitumen</b>
          <br />
          SBS is bitumen that has elastomer added by way of the rubbery
          substance styrene-butadiene-styrene. This elasticity allows it to
          absorb the movement of underlying materials and insulation as it can
          stretch to accommodate them. It also means SBS can flex under wind and
          weather stresses including the expansion and contraction British homes
          tend to experience during seasonal weather change.
          <br />
          <br />
          <b>APP bitumen</b>
          <br />
          APP-modified bitumen instead uses the plastic atactic polypropylene,
          It has a very high-temperature tolerance and is appreciated for its
          ease of installation.
          <br />
          <br />
          <b>SBS vs APP</b>
          <br />
          SBS offers more longevity and durability but has a slightly less
          forgiving installation process, requiring attention to the heat
          applied.
        </DescriptionCard>
        <DescriptionCard
          icon={VerifiedUserIcon}
          title={"Product Plus Guarantee"}
        >
          Get a Product Plus Guarantee for a BMI Icopal flat roof system that
          has already purchased.
        </DescriptionCard>
      </div>
    </Container>
  </Page>
);

export default Home;
