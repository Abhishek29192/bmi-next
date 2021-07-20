import React from "react";
import { BLOCKS, INLINES, Document } from "@contentful/rich-text-types";
import { RichText } from ".";

export default {
  title: "Rich Text",
  component: RichText
};

const document: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "BMI Group InTouch Portal – Cookie Policy",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        },
        {
          nodeType: "text",
          value: " ",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "Last updated: 8th October 2019",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            'This Cookie Policy explains how BMI Group Management UK Limited and its affiliated legal entities (together, “BMI Group” or the “Company”) uses cookies and similar technologies to recognise you when you visit our BMI Group InTouch Portal ("Portal") at my.intouch.bmigroup.com. It explains what these technologies are and why we use them, as well as your rights to control our use of them.',
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "What are cookies?",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "Cookies are small text files which are placed on your computer or mobile device when you first visit a website. Cookies are used to make the Portal work well or simply work more efficiently.",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            'Cookies set by the Portal owner (in this case, BMI Group) are called "first party cookies". Cookies set by parties other than the Portal owner are called "third party cookies". Third party cookies enable third party features or functionality to be provided on or through the Portal. ',
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "What are cookies used for?",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            'We use cookies for technical reasons in order for our Portal to operate, and we refer to these as "essential" or "strictly necessary" cookies.',
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            'The cookies we use are strictly necessary to provide you with services available through our Portal and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Portal to you, you cannot refuse them. You can block or delete them by changing your browser settings however, as described below under the heading "How to manage and disable cookies".',
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "We also use third party cookies to improve our site experience and to access content usage. Details of third party cookies are set out below.",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "The BMI Group uses the following cookies:",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "x.x Cookie Name: ",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        },
        {
          nodeType: "text",
          value: "BMICookie",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "Provider: ",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        },
        {
          nodeType: "text",
          value: "BMI Group",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "Description: ",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        },
        {
          nodeType: "text",
          value: "TBC",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "Purpose: ",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        },
        {
          nodeType: "text",
          value: "tbc",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value: "How to manage and disable cookies",
          marks: [
            {
              type: "bold"
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "In the settings of your internet browser you can choose whether or not to accept cookies. However, you must be aware of the fact that if you use your browser settings to block all cookies you may lose some features and functionality on our Portal or you may not be able to access some or all parts of the Portal.",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "The following websites provide information on how to manage and adjust the cookies settings on some popular browsers:",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.UL_LIST,
      content: [
        {
          nodeType: BLOCKS.LIST_ITEM,
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              content: [
                {
                  nodeType: "text",
                  value: "Google Chrome – ",
                  marks: [],
                  data: {}
                },
                {
                  nodeType: INLINES.HYPERLINK,
                  content: [
                    {
                      nodeType: "text",
                      value:
                        "https://support.google.com/chrome/answer/95647?hl=en&p=cpn_cookies",
                      marks: [],
                      data: {}
                    }
                  ],
                  data: {
                    uri: "https://support.google.com/chrome/answer/95647?hl=en&p=cpn_cookies"
                  }
                },
                {
                  nodeType: "text",
                  value: "",
                  marks: [],
                  data: {}
                }
              ],
              data: {}
            }
          ],
          data: {}
        },
        {
          nodeType: BLOCKS.LIST_ITEM,
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              content: [
                {
                  nodeType: "text",
                  value: "Microsoft Internet Explorer – ",
                  marks: [],
                  data: {}
                },
                {
                  nodeType: INLINES.HYPERLINK,
                  content: [
                    {
                      nodeType: "text",
                      value:
                        "https://support.microsoft.com/en-gb/help/260971/description-of-cookies",
                      marks: [],
                      data: {}
                    }
                  ],
                  data: {
                    uri: "https://support.microsoft.com/en-gb/help/260971/description-of-cookies"
                  }
                },
                {
                  nodeType: "text",
                  value: "",
                  marks: [],
                  data: {}
                }
              ],
              data: {}
            }
          ],
          data: {}
        },
        {
          nodeType: BLOCKS.LIST_ITEM,
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              content: [
                {
                  nodeType: "text",
                  value: "Mozilla Firefox – ",
                  marks: [],
                  data: {}
                },
                {
                  nodeType: INLINES.HYPERLINK,
                  content: [
                    {
                      nodeType: "text",
                      value:
                        "http://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer?redirectlocale=en-GB&redirectslug=Cookies",
                      marks: [],
                      data: {}
                    }
                  ],
                  data: {
                    uri: "http://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer?redirectlocale=en-GB&redirectslug=Cookies"
                  }
                },
                {
                  nodeType: "text",
                  value: "",
                  marks: [],
                  data: {}
                }
              ],
              data: {}
            }
          ],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "If you use other browsers you can check the support section of their websites to find out how to manage and disable cookies.",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "To find out more about cookies in general, including how to see what cookies have been set and how to manage and disable them, visit ",
          marks: [],
          data: {}
        },
        {
          nodeType: INLINES.HYPERLINK,
          content: [
            {
              nodeType: "text",
              value: "www.allaboutcookies.org",
              marks: [],
              data: {}
            }
          ],
          data: {
            uri: "http://www.allaboutcookies.org/"
          }
        },
        {
          nodeType: "text",
          value: "",
          marks: [],
          data: {}
        }
      ],
      data: {}
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      content: [
        {
          nodeType: "text",
          value:
            "If you have any questions regarding this Cookie Policy, you can contact us at privacy@bmigroup.com",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

export const Basic = () => <RichText content={document} />;
