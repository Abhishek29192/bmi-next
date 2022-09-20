// istanbul ignore file: doesn't hold any logic
import Form, { FormContext, ValidationResult, Values } from "./Form";
import withFormControl, {
  InputValue,
  Props as WithFormControlProps
} from "./withFormControl";

export type { Props as FormProps } from "./Form";
export type { InputValue, WithFormControlProps };
export type { ValidationResult, Values };
export { FormContext, withFormControl };

export default Form;
