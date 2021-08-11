export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium"
  } as any).format(new Date(date?.substring(0, 10)));
