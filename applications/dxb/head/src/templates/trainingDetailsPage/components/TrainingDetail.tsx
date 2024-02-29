import { useIsClient } from "@bmi-digital/components";
import Container from "@bmi-digital/components/container";
import Grid from "@bmi-digital/components/grid";
import Tooltip from "@bmi-digital/components/tooltip";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { microCopy } from "@bmi/microcopies";
import React, { useMemo, useState } from "react";
import ProgressIndicator from "../../../components/ProgressIndicator";
import Scrim from "../../../components/Scrim";
import { useSiteContext } from "../../../components/Site";
import { trainingCategoryMicroCopies } from "../../../constants/trainingConstants";
import { getPathWithCountryCode } from "../../../utils/path";
import { useHeaderHeight } from "../../../utils/useHeaderHeight";
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
import type { TrainingDetailsCourseType as Course } from "../types";

interface Props {
  course: Omit<Course, "breadcrumbs">;
  trainingRegistrationUrl?: string;
}

const NO_AVAILABLE_SESSIONS_MESSAGE = "There are no available sessions yet";

const TrainingDetails = ({
  course: {
    name,
    description,
    code: courseCode,
    currencySymbol,
    sessions,
    categoryName,
    img_url,
    course_type,
    price
  },
  trainingRegistrationUrl
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const headerHeight = useHeaderHeight();
  const { isClient } = useIsClient();
  const [loading, setLoading] = useState<boolean>(true);

  const trainingCardTopOffset = useMemo(
    () => `${headerHeight + 18}px`,
    [headerHeight]
  );

  const runningSessions = useMemo(() => {
    if (!isClient) {
      return;
    }

    const activeSessions = sessions.filter(
      (session) => new Date().getTime() < new Date(session.date_start).getTime()
    );

    if (loading) {
      setLoading(false);
    }

    return activeSessions.map((session, index) => (
      <Session
        key={session.id}
        index={index}
        id={session.id}
        sessionsLength={activeSessions.length}
        name={session.name}
        date_start={session.date_start}
        date_end={session.date_end}
        courseCode={courseCode}
        trainingRegistrationUrl={trainingRegistrationUrl}
      />
    ));
  }, [sessions, isClient, courseCode, trainingRegistrationUrl]);

  const availableSessionsContainerId = useMemo(
    () =>
      replaceSpaces(
        getMicroCopy(microCopy.TRAINING_DETAILS_SESSIONS_LABEL)
      ).toLowerCase(),
    [getMicroCopy]
  );

  return (
    <Wrapper>
      {loading && (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      )}
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
            {courseCode && (
              <Typography data-testid="training-id">
                {getMicroCopy(microCopy.TRAINING_ID_LABEL)} {courseCode}
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
              subtitle={`${getMicroCopy(
                microCopy.TRAINING_ID_LABEL
              )} ${courseCode}`}
              media={img_url ? <img src={img_url} alt={name} /> : undefined}
              price={
                Number(price) > 0
                  ? `${currencySymbol}${price}`
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
          {runningSessions?.length ? (
            <div data-testid="sessions-container">{runningSessions}</div>
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

const Session = ({
  index,
  id,
  sessionsLength,
  date_end,
  date_start,
  courseCode,
  name,
  trainingRegistrationUrl
}: {
  index: number;
  id: number;
  sessionsLength: number;
  date_start: number;
  date_end: number;
  courseCode: string;
  name: string;
  trainingRegistrationUrl?: string;
}) => {
  const { countryCode, getMicroCopy } = useSiteContext();

  return (
    <SessionDataContainer
      index={index}
      dataLength={sessionsLength}
      key={id}
      data-testid="available-session"
    >
      <SessionDetailContainer>
        <SessionName data-testid="session-name">{name}</SessionName>
        <SessionInterval data-testid="session-date">
          {formatDate(date_start)} - {formatDate(date_end)}
        </SessionInterval>
        <EnrollButtonContainer>
          <EnrollButton
            href={getPathWithCountryCode(
              countryCode,
              `${trainingRegistrationUrl}?trainingCode=${courseCode}&session=${id}`
            )}
            data-testid={"session-cta-button"}
            disabled={!trainingRegistrationUrl}
          >
            {getMicroCopy(microCopy.TRAINING_DETAILS_SESSION_ENROLL_LABEL)}
          </EnrollButton>
        </EnrollButtonContainer>
      </SessionDetailContainer>
    </SessionDataContainer>
  );
};

const formatDate = (date: number) => {
  const inputDate = new Date(date);
  const day = inputDate.getDate();
  const month = inputDate.getMonth() + 1;
  const year = inputDate.getFullYear();

  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
};

export default TrainingDetails;
