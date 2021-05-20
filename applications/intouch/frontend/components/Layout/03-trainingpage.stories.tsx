import React from "react";
import Grid from "@bmi/grid";
import Hero from "@bmi/hero";
import Typography from "@bmi/typography";
import { CourseDescription } from "../Cards/CourseDescription";
import { TrainingProcessCard } from "../Cards/TrainingProcess";
import GridStyles from "../../styles/Grid.module.scss";
import { Training } from "../SidePanel/index.stories";
import { Layout, LayoutProps } from ".";

export default {
  title: "Pages/Training",
  component: Layout,
  argTypes: {
    title: { control: "text" }
  }
};

let media = <img src="https://source.unsplash.com/MjLrM8rVMC0/1600"></img>;

export const Main = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <div style={{ display: "flex" }}>
      <Training />
      <Grid
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Hero media={media} title="BMI Academy" level={1}>
            BMI Academy offers the best training and the most comprehensive
            educational resources for roofing specialists in Poland. BMI Academy
            is a digital platform through which you can access the full range of
            training provided at BMI Training Centers as well as receive a wide
            range of online training content, available in the form of
            e-learning courses and live workshops and webinars.
          </Hero>

          <TrainingProcessCard />
        </Grid>
      </Grid>
    </div>
  </Layout>
);

Main.args = {
  title: "Training"
};

export const TrainingCoursePage = ({ title }: LayoutProps) => (
  <Layout title={title}>
    <div style={{ display: "flex" }}>
      <Training />
      <Grid
        container
        spacing={3}
        className={GridStyles.outerGrid}
        alignItems="stretch"
      >
        <Grid item xs={12} lg={8}>
          <CourseDescription
            title="Basic competency programme (BCP)"
            type="Pitched roof"
            status="In progress"
          >
            <Typography variant="h5">Description</Typography>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem architecto placeat inventore nostrum voluptates
              deserunt possimus laborum autem eum? Cum temporibus debitis
              delectus veniam, deleniti sequi nobis ipsa explicabo voluptate!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem architecto placeat inventore nostrum voluptates
              deserunt possimus laborum autem eum? Cum temporibus debitis
              delectus veniam, deleniti sequi nobis ipsa explicabo voluptate!
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem architecto placeat inventore nostrum voluptates
              deserunt possimus laborum autem eum? Cum temporibus debitis
              delectus veniam, deleniti sequi nobis ipsa explicabo voluptate!
            </p>
          </CourseDescription>
        </Grid>
      </Grid>
    </div>
  </Layout>
);

TrainingCoursePage.args = {
  title: "Training Course Page"
};
