import { Data } from "../../components/TitleWithContent";
import createRichText from "./RichTextHelper";

const createTitleWithContentData = (
  titleWithContent?: Partial<Data>
): Data => ({
  __typename: "ContentfulTitleWithContent",
  name: "Title with content name",
  title: "Title with content title",
  content: createRichText(),
  ...titleWithContent
});

export default createTitleWithContentData;
