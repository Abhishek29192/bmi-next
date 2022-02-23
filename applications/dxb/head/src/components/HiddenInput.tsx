import React from "react";
import { withFormControl } from "@bmi/components";
import InputBase, { InputBaseProps } from "@material-ui/core/InputBase";

const HiddenInput = withFormControl((props: InputBaseProps) => (
  <InputBase {...props} type="hidden" />
));

export default HiddenInput;
