import { GetGlobalDataQuery } from "../../../graphql/generated/operations";

export const generateGlobalPageData = (): GetGlobalDataQuery => ({
  marketContentCollection: {
    items: [
      {
        footerLinksCollection: {
          items: [
            {
              title: "Footer link title",
              relativePath: "/footer/link/relativePath"
            }
          ]
        },
        contactUsPage: {
          title: "Contact",
          relativePath: "/contact"
        },
        externalLinkUrl: "https://www.bmigroup.com/no/",
        externalLinkLabel: "BMI Norway Website"
      }
    ]
  },
  notifications: {
    nodes: [
      {
        id: 1,
        body: "Notification",
        sendDate: "2020-01-01",
        read: false
      }
    ]
  }
});
