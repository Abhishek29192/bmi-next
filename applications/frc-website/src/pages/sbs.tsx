import React from "react";
import Page from "../components/Page";
import Typography from "@bmi/typography";
import Container from "@bmi/container";

const SBS = () => (
  <Page title="SBS Calculator Page">
    <Container maxWidth="lg" style={{ padding: "50px 25px" }}>
      <Typography variant="h1" hasUnderline>
        SBS Bitumen Estimator
      </Typography>
    </Container>
  </Page>
);

export default SBS;
