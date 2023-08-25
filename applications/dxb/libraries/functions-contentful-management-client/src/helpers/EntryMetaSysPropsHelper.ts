import { EntryMetaSysProps } from "contentful-management/dist/typings/common-types";
import createEntityMetaSysProps from "./EntityMetaSysPropsHelper";

const createEntryMetaSysProps = (
  entryMetaSysProps?: Partial<EntryMetaSysProps>
): EntryMetaSysProps => ({
  ...createEntityMetaSysProps(),
  automationTags: [],
  ...entryMetaSysProps
});

export default createEntryMetaSysProps;
