import { GetCompanyQuery } from "../../graphql/generated/operations";

export const mockContactDetailsCollection: GetCompanyQuery["contactDetailsCollection"] =
  {
    items: [
      {
        fullName: "Ruth Tyler",
        subHeading: "Roofpro Marketing support",
        email: "ruthtyler@bmigroup.com",
        phoneNumber: "273482472894"
      },
      {
        fullName: "Flat roof hotline",
        subHeading: "9 to 5 Monday to Friday",
        email: "flatties@bmigroup.com",
        phoneNumber: "0044-12345667"
      }
    ]
  };
