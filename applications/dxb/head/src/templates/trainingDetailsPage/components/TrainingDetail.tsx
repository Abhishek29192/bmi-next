import React from "react";
import { Typography, replaceSpaces } from "@bmi-digital/components";
import { microCopy } from "@bmi/microcopies";
import { CourseWithSessions } from "@bmi/docebo-types";
import { useSiteContext } from "../../../components/Site";
import {
  Container,
  Title,
  CourseDescription,
  SessionContainer,
  SessionDataContainer,
  SessionDetailContainer,
  SessionInterval,
  EnrollButton,
  SessionName,
  Wrapper,
  DetailsContainer,
  EnrollButtonContainer
} from "../trainingDetailsPageStyles";

interface Props {
  course: Pick<
    CourseWithSessions,
    "id_course" | "name" | "description" | "code" | "sessions"
  >;
}

const TrainingDetails = ({
  course: { name, description, code, sessions }
}: Props) => {
  const sessions_unavailable = "There are no available sessions yet";
  const { getMicroCopy } = useSiteContext();

  const runningSessions = sessions?.filter(
    (e) => new Date() < new Date(e.date_end)
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
      <DetailsContainer>
        <Container>
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
        </Container>

        {/* leaving an empty div for the moment to allow card info to be placed here */}
        {/* <div></div> */}
      </DetailsContainer>

      <SessionContainer>
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
                    data-testId={`${replaceSpaces(name)}-session-container`}
                  >
                    <SessionDetailContainer>
                      <SessionName
                        data-testid={`${replaceSpaces(name)}-session`}
                      >
                        {name}
                      </SessionName>
                      <SessionInterval>
                        {formatDate(date_start)} - {formatDate(date_end)}
                      </SessionInterval>
                      <EnrollButtonContainer>
                        <EnrollButton>
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
          <Typography>{sessions_unavailable}</Typography>
        )}
      </SessionContainer>
    </Wrapper>
  );
};

export default TrainingDetails;
