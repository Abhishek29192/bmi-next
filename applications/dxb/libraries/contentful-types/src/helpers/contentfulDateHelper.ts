import type { EntryFields } from "contentful";

const createContentfulDate = (time: number): EntryFields.Date =>
  new Date(time).toISOString() as EntryFields.Date;

export default createContentfulDate;
