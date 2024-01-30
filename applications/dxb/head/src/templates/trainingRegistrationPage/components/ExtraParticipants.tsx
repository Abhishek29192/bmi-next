import { FormContext } from "@bmi-digital/components/form";
import Grid from "@bmi-digital/components/grid";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces } from "@bmi-digital/components/utils";
import Box from "@mui/material/Box";
import getUniqueId from "lodash-es/uniqueId";
import React, { useContext, useState } from "react";
import {
  AddParticipantButton,
  ParticipantContainer,
  RemoveParticipantButton,
  StyledGrid,
  SubTitle
} from "./ExtraParticipantsStyles";
import TextField from "./TextField";

const MAX_EXTRA_PARTICIPANTS_COUNT = 3;

export type ExtraParticipantsProps = {
  title: string;
  removeButtonLabel: string;
  addParticipantButtonLabel: string;
  subtitle: string;
  participantTitle: string;
  firstNameLabel: string;
  lastNameLabel: string;
};

type Participant = { participantId: string };

const ExtraParticipants = (props: ExtraParticipantsProps) => {
  const { updateFormState } = useContext(FormContext);
  const [extraParticipants, setExtraParticipants] = useState<Participant[]>([]);

  const addNewParticipant = () => {
    setExtraParticipants((prevParticipants) => [
      ...prevParticipants,
      { participantId: getUniqueId() }
    ]);
  };

  const removeParticipant = (id: string) => {
    const participantsCount = extraParticipants.length;
    setExtraParticipants((prevParticipants) =>
      prevParticipants.filter(({ participantId }) => participantId !== id)
    );

    /**
     * Removes data about the last participant
     * Once the participant has been removed, we need to clear the data about the last one
     * Because after the removal we have one participant less
     */
    updateFormState({
      [`${props.firstNameLabel}-${participantsCount}`]: undefined,
      [`${props.lastNameLabel}-${participantsCount}`]: undefined
    });
  };

  return (
    <div>
      <Typography variant="h5" data-testid="add-extra-participant-title">
        {props.title}
      </Typography>
      <SubTitle data-testid="add-extra-participant-subtitle">
        {props.subtitle}
      </SubTitle>
      {extraParticipants.map(({ participantId }, index) => (
        <ParticipantFields
          key={participantId}
          participantTitle={props.participantTitle}
          removeButtonLabel={props.removeButtonLabel}
          firstNameLabel={props.firstNameLabel}
          lastNameLabel={props.lastNameLabel}
          participantId={participantId}
          removeParticipant={removeParticipant}
          index={index + 1}
        />
      ))}
      {extraParticipants.length < MAX_EXTRA_PARTICIPANTS_COUNT && (
        <AddParticipantButton
          variant="outlined"
          size="large"
          onClick={addNewParticipant}
          data-testid="add-extra-participant-button"
        >
          {props.addParticipantButtonLabel}
        </AddParticipantButton>
      )}
    </div>
  );
};

type ParticipantFieldsType = {
  participantTitle: string;
  removeButtonLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  participantId: string;
  removeParticipant: (participantId: string) => void;
  index: number;
};

const ParticipantFields = (props: ParticipantFieldsType) => {
  const removeParticipant = () => {
    props.removeParticipant(props.participantId);
  };

  return (
    <ParticipantContainer>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="h6" mr="12px" data-testid="participant-title">
          {props.participantTitle}
        </Typography>
        <RemoveParticipantButton
          variant="text"
          size="large"
          onClick={removeParticipant}
          data-testid="remove-participant-button"
        >
          {props.removeButtonLabel}
        </RemoveParticipantButton>
      </Box>
      <Grid container>
        <Grid xs={12} lg={6}>
          <TextField
            id={`${replaceSpaces(props.firstNameLabel)} ${props.index}`}
            name={`${props.firstNameLabel} ${props.index}`}
            variant="outlined"
            label={props.firstNameLabel}
            fullWidth
          />
        </Grid>
        <StyledGrid xs={12} lg={6}>
          <TextField
            id={`${replaceSpaces(props.lastNameLabel)} ${props.index}`}
            name={`${props.lastNameLabel} ${props.index}`}
            variant="outlined"
            label={props.lastNameLabel}
            fullWidth
          />
        </StyledGrid>
      </Grid>
    </ParticipantContainer>
  );
};

export default ExtraParticipants;
