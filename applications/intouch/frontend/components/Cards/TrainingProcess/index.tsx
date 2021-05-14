import React from "react";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { Search, School } from "@material-ui/icons";
import { InfoPair } from "../../InfoPair";
import styles from "./styles.module.scss";

export type TrainingProcessCardProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const TrainingProcessCard = ({ children }: TrainingProcessCardProps) => {
  return (
    <div className={styles.main}>
      <Typography variant="h4" hasUnderline>
        The Training Process
      </Typography>
      <div className={styles.body}>
        <div className={styles.subcontent}>
          <div className={styles.heading}>
            <Icon source={Search} />
            <Typography variant="h5">Step 1</Typography>
          </div>
          <InfoPair title="Find the right training">
            Search our extensive library of classroom training, workshops,
            online webinars and e-learning courses to find what you need and
            take your skills to the next level.
          </InfoPair>
        </div>
        <div className={styles.subcontent}>
          <div className={styles.heading}>
            <Icon source={School} />
            <Typography variant="h5">Step 2</Typography>
          </div>
          <InfoPair title="Increase your skills">
            Continue personal development to hone your skills in areas where you
            need additional knowledge.
          </InfoPair>
        </div>
        <div className={styles.subcontent}>
          <div className={styles.heading}>
            <Icon source={School} />
            <Typography variant="h5">Step 3</Typography>
          </div>
          <InfoPair title="Get certified">
            Develop your training achievements by collecting BMI certificates,
            which you can additionally share with others. They will always be
            visible on your profile.
          </InfoPair>
        </div>
      </div>
    </div>
  );
};
