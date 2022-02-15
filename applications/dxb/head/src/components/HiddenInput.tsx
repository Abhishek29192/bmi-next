import React from "react";
import { withFormControl } from "@bmi-digital/components";
import InputBase, { InputBaseProps } from "@material-ui/core/InputBase";

const HiddenInput = withFormControl((props: InputBaseProps) => (
  <InputBase {...props} type="hidden" />
));

export default HiddenInput;
