import resolveRichText from "./ContentfulRichText";
import type { Data as TitleWithContentData } from "../../components/TitleWithContent";
import type { ContentfulTitleWithContentData } from "./types/TitleWithContent";

const resolveTitleWithContent = async ({
  content,
  ...rest
}: ContentfulTitleWithContentData): Promise<TitleWithContentData> => ({
  ...rest,
  content: await resolveRichText(content)
});

export default resolveTitleWithContent;
