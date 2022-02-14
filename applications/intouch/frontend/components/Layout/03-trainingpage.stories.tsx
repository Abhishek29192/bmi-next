import React from "react";
import Grid from "@bmi-digital/components/grid";
import Hero from "@bmi-digital/components/hero";
import Typography from "@bmi-digital/components/typography";
import { TrainingQuery } from "../../graphql/generated/operations";
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

const media = <img src="https://source.unsplash.com/MjLrM8rVMC0/1600"></img>;

const trainingProcessCardData: TrainingQuery["trainingContentCollection"] = {
  items: [
    {
      pageSubHeading: "The Training Process",
      step1Heading: "Step 1",
      step1SubHeading: "Find the right training",
      step1Description: `Search our extensive library of classroom training, workshops,
  online webinars and e-learning courses to find what you need and
  take your skills to the next level.`,
      step2Heading: "Step 2",
      step2SubHeading: "Increase your skills",
      step2Description: `Continue personal development to hone your skills in areas where you
  need additional knowledge.`,
      step3Heading: "Step 3",
      step3SubHeading: "Get certified",
      step3Description: `Develop your training achievements by collecting BMI certificates,
  which you can additionally share with others. They will always be
  visible on your profile.`
    }
  ]
};

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

          <TrainingProcessCard data={trainingProcessCardData} />
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
            image="https://source.unsplash.com/MjLrM8rVMC0/799x500/?architecture"
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
