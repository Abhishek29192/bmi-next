import React from "react";
import { StyledTextField } from "./styles";

const RawTextField = ({
  className,
  isTextArea,
  isRequired,
  error,
  helperText,
  errorText,
  onChange,
  "data-testid": dataTestId,
  ...props
}: React.ComponentProps<typeof StyledTextField>) => {
  return (
    <StyledTextField
      {...props}
      helperText={error ? errorText : helperText}
      error={error}
      multiline={isTextArea}
      onChange={onChange}
      data-testid={dataTestId}
    />
  );
};

export default RawTextField;
