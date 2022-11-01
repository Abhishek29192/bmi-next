import { withFormControl } from "@bmi-digital/components";
import InputBase, { InputBaseProps } from "@material-ui/core/InputBase";
import React from "react";

const HiddenInput = withFormControl((props: InputBaseProps) => (
  <InputBase {...props} type="hidden" />
));

export default HiddenInput;
