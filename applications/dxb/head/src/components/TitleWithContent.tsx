// Todo: somehow get the fragments from inside RichText???
import { RichTextData } from "./RichText";

export type Data = {
  __typename: "TitleWithContent";
  name: string;
  title: string | null;
  content: RichTextData;
};
