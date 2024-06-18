import { useIsClient } from "@bmi-digital/components/hooks";
import { replaceSpaces } from "@bmi-digital/components/utils";
import Container from "@bmi-digital/components/container";
import Grid from "@bmi-digital/components/grid";
import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import React, { useMemo, useRef, useState } from "react";
import ProgressIndicator from "../../../components/ProgressIndicator";
import Scrim from "../../../components/Scrim";
import { useSiteContext } from "../../../components/Site";
import { getPathWithCountryCode } from "../../../utils/path";
import { useHeaderHeight } from "../../../utils/useHeaderHeight";
import {
  CourseDescription,
  EnrollButton,
  EnrollButtonContainer,
  MobileTrainingInfoGrid,
  SessionContainer,
  SessionDataContainer,
  SessionDetailContainer,
  SessionInterval,
  SessionName,
  StyledCardGrid,
  Title,
  TrainingCode,
  Wrapper
} from "../trainingDetailsPageStyles";
import DesktopTrainingCard from "./DesktopTrainingCard";
import MobileStickyFooter from "./MobileStickyFooter";
import MobileTrainingInfo from "./MobileTrainingInfo";
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
  const sessionsSectionRef = useRef<HTMLDivElement | null>(null);

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
  }, [sessions, isClient, courseCode, loading, trainingRegistrationUrl]);

  const availableSessionsContainerId = useMemo(
    () =>
      replaceSpaces(
        getMicroCopy(microCopy.TRAINING_DETAILS_SESSIONS_LABEL)
      ).toLowerCase(),
    [getMicroCopy]
  );
  const scrollToSessions = () => {
    //Should be used for the desktop version after switching
    //to the new version of the Training Details Card component
    sessionsSectionRef.current?.scrollIntoView();
  };

  return (
    <Wrapper>
      {loading && (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      )}
      <Container>
        <Grid container spacing={3}>
          <MobileTrainingInfoGrid
            xs={12}
            md={12}
            data-testid="mobile-training-info-grid"
          >
            <MobileTrainingInfo
              code={courseCode}
              categoryName={categoryName}
              name={name}
              course_type={course_type}
              price={price}
              currencySymbol={currencySymbol}
              img_url={img_url}
            />
          </MobileTrainingInfoGrid>
          <Grid xs={12} md={12} lg={8}>
            <Title
              variant="h1"
              hasUnderline
              hasDarkBackground
              data-testid="training-name"
            >
              {name}
            </Title>
            <TrainingCode data-testid="training-code">
              {getMicroCopy(microCopy.TRAINING_CODE_LABEL)} {courseCode}
            </TrainingCode>
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
            <DesktopTrainingCard
              code={courseCode}
              categoryName={categoryName}
              name={name}
              course_type={course_type}
              price={price}
              currencySymbol={currencySymbol}
              img_url={img_url}
              sessionsContainerId={availableSessionsContainerId}
            />
          </StyledCardGrid>
        </Grid>
      </Container>
      <MobileStickyFooter
        disabled={!runningSessions?.length}
        scrollToSessions={scrollToSessions}
      />
      <SessionContainer
        id={availableSessionsContainerId}
        ref={sessionsSectionRef}
        data-testid="available-sessions"
      >
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
