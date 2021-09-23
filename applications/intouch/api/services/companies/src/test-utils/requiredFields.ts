// TODO: Use something like factories for the required fields?
// TODO: This could use transformed TS types using TS 4.1 Mapped Types I believe
// https://stackoverflow.com/a/63682391/3653001
// NOTE: these should match DB field names
// DB is snake_case, TS types are camelCase
const requiredFields = {
  project: {
    name: "name",
    roof_area: 1,
    technology: "PITCHED",
    start_date: "2020-01-01",
    end_date: "2020-01-01"
  },
  account: {
    first_name: "Joe",
    last_name: "Doe",
    email: `joe@email.invalid`
  }
};

export default requiredFields;
