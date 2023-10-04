import React from "react";
import { Typography } from "@bmi-digital/components";
import { microCopy } from "@bmi/microcopies";
import { useSiteContext } from "../../../components/Site";
import { DoceboCourse } from "../../../types/pim";
import {
  Container,
  Title,
  CourseDescription
} from "../trainingDetailsPageStyles";

interface Props {
  course: DoceboCourse;
}

const TrainingDetails = ({ course: { name, description, code } }: Props) => {
  const { getMicroCopy } = useSiteContext();
  return (
    <Container>
      <Title
        variant="h1"
        hasUnderline
        hasDarkBackground
        data-testid="training-name"
      >
        {name}
      </Title>
      <Typography data-testid="training-id">
        {getMicroCopy(microCopy.TRAINING_DETAILS_COURSE_ID_LABEL)}: {code}
      </Typography>
      <CourseDescription
        dangerouslySetInnerHTML={{ __html: description }}
        data-testid="training-description"
      />
    </Container>
  );
};

export default TrainingDetails;
