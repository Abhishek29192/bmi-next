import type { Data as ShareWidgetData } from "../../components/ShareWidgetSection";

const createShareWidgetData = (
  data?: Partial<ShareWidgetData>
): ShareWidgetData => ({
  __typename: "ShareWidgetSection",
  title: "Share Now",
  message: null,
  clipboardSuccessMessage: null,
  clipboardErrorMessage: null,
  isLeftAligned: null,
  copy: null,
  email: null,
  facebook: null,
  linkedin: null,
  pinterest: null,
  twitter: null,
  ...data
});

export default createShareWidgetData;
