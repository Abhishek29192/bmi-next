import createEntrySys from "./entrySysHelper";
import type { TypeShareWidgetSection } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedShareWidget = (
  contentfulShareWidget?: EntryPartial<
    TypeShareWidgetSection<undefined, "en-US">
  >
): TypeShareWidgetSection<undefined, "en-US"> => {
  const shareWidget = createShareWidget(contentfulShareWidget);
  return {
    ...shareWidget,
    fields: {
      message: "share widget message",
      clipboardSuccessMessage: "share widget clipboard success message",
      clipboardErrorMessage: "share widget clipboard error message",
      isLeftAligned: true,
      email: true,
      copy: true,
      linkedin: true,
      twitter: true,
      facebook: true,
      pinterest: true,
      ...shareWidget.fields
    }
  };
};

const createShareWidget = (
  contentfulShareWidget?: EntryPartial<
    TypeShareWidgetSection<undefined, "en-US">
  >
): TypeShareWidgetSection<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "shareWidgetSection"
      }
    },
    ...contentfulShareWidget?.sys
  },
  metadata: {
    tags: [],
    ...contentfulShareWidget?.metadata
  },
  fields: {
    title: "share widget title",
    ...contentfulShareWidget?.fields
  }
});

export default createShareWidget;
