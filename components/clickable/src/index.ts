import Clickable, {
  ClickableAction as ClickableActionType,
  Props
} from "./Clickable";

export type ClickableProps = Props;
export type ClickableAction = ClickableActionType;
export { withClickable } from "./Clickable";

export default Clickable;
