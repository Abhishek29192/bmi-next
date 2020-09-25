import React from "react";
import Page from "../components/Page";
import Typography from "@bmi/typography";
import Container from "@bmi/container";

const Home = () => (
  <Page title="Flat Roof Calcualtor Landing Page">
    <Container maxWidth="lg" style={{ padding: "50px 25px" }}>
      <Typography variant="h1" hasUnderline>
        Deployment test for Flat Roof Calcualtor
      </Typography>
    </Container>
  </Page>
);

export default Home;
