import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

const pageContentTypes = [
  "page",
  "homePage",
  "teamPage",
  "contactUsPage",
  "productListerPage"
];

export const description =
  "Link input banner entity for the following pages: " +
  pageContentTypes.join(", ");

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  let inputBannerRequest;
  try {
    inputBannerRequest = await context!.makeRequest({
      method: "GET",
      url: "entries?content_type=inputBanner"
    });
  } catch (error) {
    console.log(
      "\n",
      "Something went wrong",
      ("message" in (error as any) &&
        JSON.parse((error as any).message).message) ||
        "",
      "/n"
    );
    return;
  }
  const inputBanner = inputBannerRequest.items[0];
  pageContentTypes.forEach((contentType) => {
    const currentContentType = migration.editContentType(contentType);
    currentContentType
      .createField("inputBanner")
      .name("Input Banner")
      .type("Link")
      .validations([{ linkContentType: ["inputBanner"] }])
      .linkType("Entry");
    currentContentType.changeFieldControl(
      "inputBanner",
      "builtin",
      "entryLinkEditor"
    );
    if (inputBanner) {
      migration.transformEntries({
        contentType,
        from: ["showSignUpBanner"],
        to: ["inputBanner"],
        transformEntryForLocale: function (fromFields, currentLocale) {
          if (
            !fromFields.showSignUpBanner ||
            !fromFields.showSignUpBanner[currentLocale]
          ) {
            return;
          }
          return {
            inputBanner: {
              sys: { type: "Link", linkType: "Entry", id: inputBanner.sys.id }
            }
          };
        }
      });
    }
    currentContentType.deleteField("showSignUpBanner");
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  pageContentTypes.forEach((contentType) => {
    const currentContentType = migration.editContentType(contentType);

    currentContentType
      .createField("showSignUpBanner")
      .name("Show Sign Up Banner")
      .type("Boolean");
    currentContentType.changeFieldControl(
      "showSignUpBanner",
      "builtin",
      "boolean"
    );

    migration.transformEntries({
      contentType,
      from: ["inputBanner"],
      to: ["showSignUpBanner"],
      transformEntryForLocale: function (fromFields, currentLocale) {
        return {
          showSignUpBanner: Boolean(
            fromFields.inputBanner && fromFields.inputBanner[currentLocale]
          )
        };
      }
    });

    currentContentType.deleteField("inputBanner");
  });
};
