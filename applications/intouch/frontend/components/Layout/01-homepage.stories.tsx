import React from "react";
import Hero from "@bmi/hero";
import Carousel from "@bmi/carousel";
import Grid from "@bmi/grid";
import Section from "@bmi/section";
import Typography from "@bmi/typography";
import { BrandCard } from "../Cards/BrandCard";
import { Layout, LayoutProps } from ".";

export default {
  title: "Pages/Home",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

export const CompanyHome = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <Hero
      level={0}
      hasSpaceBottom
      autoPlayInterval={10000}
      heroes={[
        {
          title: "H1 First heading dark background",
          children:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula. Phasellus suscipit dolor nisl, nec vestibulum odio molestie tincidunt.",
          imageSource: "https://source.unsplash.com/MjLrM8rVMC0/1200x1200"
        },
        {
          title: "H1 Second heading dark background",
          children:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
          imageSource: "https://source.unsplash.com/MjLrM8rVMC0/1200x1200"
        },
        {
          title: "H1 Third heading dark background",
          children:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tincidunt quam. Fusce et semper lectus, eu tincidunt ligula.",
          imageSource: "https://source.unsplash.com/MjLrM8rVMC0/1200x1200"
        }
      ]}
    />

    <Section backgroundColor="white" isSlim>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <Section.Title>BMI Partner Brands</Section.Title>
          <Typography>
            BMI is pleased to offer RoofPro members special discounts and
            promotions available from our Partner Brands, including DJI, FLIR,
            Expensify, Enterprise and SIXT. These organizations provide members
            with access to complementary products and services on preferential
            terms, including drones, thermal imaging cameras, expenses
            management solutions, vehicle rental and mobility solutions.
          </Typography>
        </Grid>
      </Grid>
    </Section>
  </Layout>
);

CompanyHome.args = {
  title: "JS Roofers"
};
