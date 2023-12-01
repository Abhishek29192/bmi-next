import React, { useMemo } from "react";
import Container from "@bmi-digital/components/container";
import Grid from "@bmi-digital/components/grid";
import Tooltip from "@bmi-digital/components/tooltip";
import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { useSiteContext } from "../../../components/Site";
import { trainingCategoryMicroCopies } from "../../../constants/trainingConstants";
import {
  CourseDescription,
  EnrollButton,
  EnrollButtonContainer,
  SessionContainer,
  SessionDataContainer,
  SessionDetailContainer,
  SessionInterval,
  SessionName,
  StyledCardGrid,
  StyledTrainingCard,
  Title,
  TooltipPopper,
  TrainingCardFooterButton,
  TrainingInfoContainer,
  Wrapper
} from "../trainingDetailsPageStyles";
import { useHeaderHeight } from "../../../utils/useHeaderHeight";
import type { TrainingDetailsCourseType as Course } from "../types";

interface Props {
  course: Omit<Course, "breadcrumbs">;
}

const NO_AVAILABLE_SESSIONS_MESSAGE = "There are no available sessions yet";

const TrainingDetails = ({
  course: {
    name,
    description,
    code,
    sessions,
    categoryName,
    img_url,
    course_type,
    price
  }
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const headerHeight = useHeaderHeight();

  const trainingCardTopOffset = useMemo(
    () => `${headerHeight + 18}px`,
    [headerHeight]
  );

  const runningSessions = useMemo(
    () => sessions?.filter((e) => new Date() < new Date(e.date_end)),
    [sessions]
  );

  const availableSessionsContainerId = useMemo(
    () =>
      replaceSpaces(
        getMicroCopy(microCopy.TRAINING_DETAILS_SESSIONS_LABEL)
      ).toLowerCase(),
    [getMicroCopy]
  );

  function formatDate(inputDateString: string) {
    const inputDate = new Date(inputDateString);
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1;
    const year = inputDate.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate;
  }

  return (
    <Wrapper>
      <Container>
        <TrainingInfoContainer container spacing={3}>
          <Grid xs={12} md={12} lg={8}>
            <Title
              variant="h1"
              hasUnderline
              hasDarkBackground
              data-testid="training-name"
            >
              {name}
            </Title>
            {code && (
              <Typography data-testid="training-id">
                {getMicroCopy(microCopy.TRAINING_ID_LABEL)} {code}
              </Typography>
            )}
            <CourseDescription
              dangerouslySetInnerHTML={{ __html: description }}
              data-testid="training-description"
            />
          </Grid>
          <StyledCardGrid
            xs={12}
            md={12}
            lg={4}
            top={trainingCardTopOffset}
            data-testid="training-card-sticky-container"
          >
            <StyledTrainingCard
              clickableArea="none"
              title={name}
              subtitle={`${getMicroCopy(microCopy.TRAINING_ID_LABEL)} ${code}`}
              media={img_url && <img src={img_url} alt={name} />}
              price={
                price
                  ? `€${price}`
                  : getMicroCopy(microCopy.TRAINING_PRICE_FREE)
              }
              category={{
                type: categoryName,
                label: getMicroCopy(
                  trainingCategoryMicroCopies[categoryName.toUpperCase()]
                )
              }}
              trainingType={{
                type: course_type,
                label: getMicroCopy(`trainingType.${course_type}`)
              }}
              footerButtonLabel={getMicroCopy(
                microCopy.TRAINING_DETAILS_SEE_AVAILABLE_SESSIONS_BUTTON
              )}
              footerButtonComponent={(props) => (
                <Tooltip
                  title={getMicroCopy(
                    microCopy.TRAINING_DETAILS_NO_SESSIONS_TOOLTIP_MESSAGE
                  )}
                  placement="top"
                  enterTouchDelay={0}
                  components={{
                    Tooltip: TooltipPopper
                  }}
                  disableHoverListener={Boolean(runningSessions?.length)}
                  disableTouchListener={Boolean(runningSessions?.length)}
                >
                  <div>
                    <TrainingCardFooterButton
                      {...props}
                      disabled={!runningSessions?.length}
                      variant="contained"
                      size="large"
                      href={`#${availableSessionsContainerId}`}
                    />
                  </div>
                </Tooltip>
              )}
            />
          </StyledCardGrid>
        </TrainingInfoContainer>
      </Container>
      <SessionContainer id={availableSessionsContainerId}>
        <Container>
          <Title
            variant="h4"
            hasUnderline
            hasDarkBackground
            data-testid="sessions-title"
          >
            {getMicroCopy(microCopy.TRAINING_DETAILS_SESSIONS_LABEL)}
          </Title>
          {runningSessions && runningSessions.length > 0 ? (
            <div data-testid="sessions-container">
              {runningSessions?.map(
                ({ name, code, date_start, date_end }, index) => {
                  return (
                    <SessionDataContainer
                      index={index}
                      dataLength={runningSessions.length}
                      key={code}
                      data-testid={"available-session"}
                    >
                      <SessionDetailContainer>
                        <SessionName data-testid={"session-name"}>
                          {name}
                        </SessionName>
                        <SessionInterval data-testid={"session-date"}>
                          {formatDate(date_start)} - {formatDate(date_end)}
                        </SessionInterval>
                        <EnrollButtonContainer>
                          <EnrollButton data-testid={"session-cta-button"}>
                            {getMicroCopy(
                              microCopy.TRAINING_DETAILS_SESSION_ENROLL_LABEL
                            )}
                          </EnrollButton>
                        </EnrollButtonContainer>
                      </SessionDetailContainer>
                    </SessionDataContainer>
                  );
                }
              )}
            </div>
          ) : (
            <Typography data-testid={"no-available-sessions"}>
              {NO_AVAILABLE_SESSIONS_MESSAGE}
            </Typography>
          )}
        </Container>
      </SessionContainer>
    </Wrapper>
  );
};

export default TrainingDetails;
