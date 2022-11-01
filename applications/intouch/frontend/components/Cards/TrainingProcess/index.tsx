import { Icon, Typography } from "@bmi-digital/components";
import { School, Search, VerifiedUser } from "@material-ui/icons";
import React from "react";
import { TrainingQuery } from "../../../graphql/generated/operations";
import { InfoPair } from "../../InfoPair";
import { SimpleCard } from "../SimpleCard";
import styles from "./styles.module.scss";

export type TrainingProcessCardProps = {
  data: TrainingQuery["trainingContentCollection"];
};

export const TrainingProcessCard = ({ data }: TrainingProcessCardProps) => {
  const {
    pageSubHeading,
    step1Heading,
    step1SubHeading,
    step1Description,
    step2Heading,
    step2SubHeading,
    step2Description,
    step3Heading,
    step3SubHeading,
    step3Description
  } = data.items[0];
  return (
    <SimpleCard style={{ marginTop: "1.5rem" }}>
      <Typography variant="h4" hasUnderline>
        {pageSubHeading}
      </Typography>
      <div className={styles.body}>
        <div className={styles.subcontent}>
          <div className={styles.heading}>
            <Icon source={Search} />
            <Typography variant="h5">{step1Heading}</Typography>
          </div>
          <InfoPair title={step1SubHeading}>{step1Description}</InfoPair>
        </div>
        <div className={styles.subcontent}>
          <div className={styles.heading}>
            <Icon source={School} />
            <Typography variant="h5">{step2Heading}</Typography>
          </div>
          <InfoPair title={step2SubHeading}>{step2Description}</InfoPair>
        </div>
        <div className={styles.subcontent}>
          <div className={styles.heading}>
            <Icon source={VerifiedUser} />
            <Typography variant="h5">{step3Heading}</Typography>
          </div>
          <InfoPair title={step3SubHeading}>{step3Description}</InfoPair>
        </div>
      </div>
    </SimpleCard>
  );
};
