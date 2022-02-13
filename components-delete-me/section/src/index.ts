// istanbul ignore file: doesn't hold any logic
import Section, {
  Props as SectionProps,
  SectionContext,
  BackgroundColor as SectionBackgroundColor
} from "./Section";

export type BackgroundColor = SectionBackgroundColor;
export type Props = SectionProps;
export { SectionContext };
export default Section;
