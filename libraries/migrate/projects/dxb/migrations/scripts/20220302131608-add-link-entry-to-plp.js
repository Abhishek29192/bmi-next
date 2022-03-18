module.exports.description = "Add link entry to PLP";

const {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} = require("../../../../utils/richTextValidations");

module.exports.up = async (migration, { makeRequest }) => {
  const productListerPage = migration.editContentType("productListerPage");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "productListerPage",
    "content"
  );

  const newValidEntries = [
    "brandLandingPage",
    "contactUsPage",
    "documentLibraryPage",
    "homePage",
    "link",
    "page",
    "productListerPage"
  ];

  productListerPage.editField("content").validations([
    {
      enabledNodeTypes: [
        ...enabledNodeTypesValidation.enabledNodeTypes,
        "entry-hyperlink",
        "asset-hyperlink"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...enabledNodeTypesValidation.enabledNodeTypes,
        "entry-hyperlink",
        "asset-hyperlink"
      ])
    },
    {
      nodes: {
        "entry-hyperlink": [{ linkContentType: newValidEntries }]
      }
    }
  ]);
};

module.exports.down = async (migration, { makeRequest }) => {
  const leadBlockSection = migration.editContentType("productListerPage");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "productListerPage",
    "content"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation.enabledNodeTypes.filter(
      (node) => node !== "entry-hyperlink"
    );

  leadBlockSection.editField("content").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
