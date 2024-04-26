import Calender from "@bmi-digital/components/icon/Calender";
import ConnectedTv from "@bmi-digital/components/icon/ConnectedTv";
import ContactsOutlined from "@bmi-digital/components/icon/ContactsOutlined";
import FlatRoof from "@bmi-digital/components/icon/FlatRoof";
import Laptop from "@bmi-digital/components/icon/Laptop";
import OtherTraining from "@bmi-digital/components/icon/OtherTraining";
import PitchedRoof from "@bmi-digital/components/icon/PitchedRoof";
import TollOutlined from "@bmi-digital/components/icon/TollOutlined";
import Section from "@bmi-digital/components/section";
import { CategoryType, CourseType } from "@bmi/docebo-types";
import { Training } from "@bmi/elasticsearch-types";
import { MicroCopyValues, microCopy } from "@bmi/microcopies";
import React from "react";
import { useSiteContext } from "../../../components/Site";
import { trainingCategoryMicroCopies } from "../../../constants/trainingConstants";
import { useConfig } from "../../../contexts/ConfigProvider";
import {
  StyledIcon,
  TrainingDataContainer,
  TrainingDesc,
  TrainingDetailContainer,
  TrainingLabel,
  TrainingSeparation
} from "../trainingRegistrationPageStyles";

type Props = {
  training: Training;
};

const trainingCategoriesIcon: Record<CategoryType, React.ElementType> = {
  Pitched: PitchedRoof,
  Flat: FlatRoof,
  Other: OtherTraining
};

const trainingTypeIcon: Record<CourseType, React.ElementType> = {
  classroom: ContactsOutlined,
  elearning: ConnectedTv,
  webinar: Laptop
};

const TrainingRegistrationHeader = ({ training }: Props) => {
  const {
    courseName,
    courseCode,
    courseType,
    category,
    currencySymbol,
    onSale,
    startDate,
    price
  } = training;
  const { getMicroCopy } = useSiteContext();
  const { marketLocaleCode } = useConfig();

  const formatDate = (inputDate: number) =>
    new Intl.DateTimeFormat(marketLocaleCode, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(inputDate));

  return (
    <Section backgroundColor="pearl">
      <Section.Title
        variant="h1"
        data-testid="training-registration-page-header-title"
      >
        {`${courseName} ${getMicroCopy(microCopy.TRAINING_REGISTRATION)}`}
      </Section.Title>

      <TrainingDataContainer>
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.TRAINING_CODE_LABEL)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-code">{courseCode}</TrainingDesc>
        </TrainingDetailContainer>
        <TrainingSeparation />
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.FILTER_LABELS_CATEGORY)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-category">
            {/* eslint-disable-next-line security/detect-object-injection */}
            <StyledIcon source={trainingCategoriesIcon[category]} />
            {/* eslint-disable-next-line security/detect-object-injection */}
            {getMicroCopy(trainingCategoryMicroCopies[category])}
          </TrainingDesc>
        </TrainingDetailContainer>
        <TrainingSeparation />
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.TRAINING_REGISTRATION_TYPE)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-type">
            {/* eslint-disable-next-line security/detect-object-injection */}
            <StyledIcon source={trainingTypeIcon[courseType]} />
            {getMicroCopy(`trainingType.${courseType}` as MicroCopyValues)}
          </TrainingDesc>
        </TrainingDetailContainer>
        <TrainingSeparation />
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.TRAINING_REGISTRATION_COST)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-price">
            <StyledIcon source={TollOutlined} />
            {onSale
              ? `${currencySymbol}${price}`
              : getMicroCopy(microCopy.TRAINING_PRICE_FREE)}
          </TrainingDesc>
        </TrainingDetailContainer>
        <TrainingSeparation />
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.TRAINING_REGISTRATION_DATE)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-start-date">
            <StyledIcon source={Calender} />
            {formatDate(startDate)}
          </TrainingDesc>
        </TrainingDetailContainer>
      </TrainingDataContainer>
    </Section>
  );
};

export default TrainingRegistrationHeader;
