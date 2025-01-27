import Button from "@bmi-digital/components/button";
import Grid from "@bmi-digital/components/grid";
import Hero from "@bmi-digital/components/hero";
import HelpOutlineIcon from "@bmi-digital/components/icon/QuestionMarkOutline";
import VerifiedUserIcon from "@bmi-digital/components/icon/VerifiedUser";
import Typography from "@bmi-digital/components/typography";
import queryString from "query-string";
import React from "react";
import Container from "../components/Container";
import DescriptionCard from "../components/DescriptionCard";
import OptionCard from "../components/OptionCard";
import { StyledPage } from "../components/styles/PageStyles";
import landing from "../images/landing.jpg";

const VALUES_PARAM = "v";

const getLink = (page: string, values: Record<string, unknown>): string => {
  const currentQueryParams =
    typeof window === "undefined"
      ? {}
      : queryString.parse(window.location.search);
  const encoded = queryString.stringify({
    ...currentQueryParams,
    [VALUES_PARAM]: encodeURIComponent(JSON.stringify(values)) // encode `"` to avoid Azure 403 error.
  });

  return page + "?" + encoded;
};

const Home = () => (
  <StyledPage title="Bituman Flat Roof Estimator">
    <Hero
      title="Bitumen Flat Roof Estimator"
      level={1}
      media={{
        src: landing,
        alt: "Bitumen Flat Roof Estimator",
        loading: "eager"
      }}
      className="hero"
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
        <Grid>
          <Button className="link" href={getLink("sbs", { guarantee: "20" })}>
            20 Year System
          </Button>
        </Grid>
        <Grid>
          <Button className="link" href={getLink("sbs", { guarantee: "15" })}>
            15 Year System
          </Button>
        </Grid>
      </OptionCard>
      <OptionCard
        title={"APP Bitumen"}
        description={
          "BMI Icopal APP Bitumen systems come in two colour finishes and offer a 15 year guarantee."
        }
      >
        <Button className="link" href={getLink("app", { guarantee: "15" })}>
          15 Year System
        </Button>
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
  </StyledPage>
);

export default Home;
