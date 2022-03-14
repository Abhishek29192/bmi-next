// istanbul ignore file: doesn't hold any logic
import Checkbox, { Props as CheckboxProps } from "./Checkbox";
import { useStyles } from "./styles";

export type Props = CheckboxProps;
export const checkboxStyles = useStyles;
export default Checkbox;
