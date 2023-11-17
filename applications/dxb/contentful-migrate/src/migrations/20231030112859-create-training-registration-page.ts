import { getExtensions } from "@bmi-digital/contentful-migration";
import { internalName } from "../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Content model for training registration page";

export const up: MigrationFunction = async (migration, context) => {
  const trainingRegistrationPage = migration
    .createContentType("trainingRegistrationPage")
    .name("Training Registration Page")
    .displayField("name");

  trainingRegistrationPage
    .createField("name")
    .name("Name")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  trainingRegistrationPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("salutationTitle")
    .name("Salutation Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("salutationMale")
    .name("Salutation (Male option)")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("salutationFemale")
    .name("Salutation (Female option)")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("firstName")
    .name("First Name")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("lastName")
    .name("Last Name")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("email")
    .name("Email")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("companyName")
    .name("Company Name")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("position")
    .name("Position")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("customerNumber")
    .name("Customer Number")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("city")
    .name("City")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("street")
    .name("Street")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("postalCode")
    .name("Postal Code")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("phoneNumber")
    .name("Phone Number")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("competentChamberLabel")
    .name("Compenent Chamber Label")
    .type("Text")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("competentChamber")
    .name("Competent Chamber")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("bmiSystemPartnerClubTitle")
    .name("System partner Club - Radio group title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("isMemberOfBmiLabel")
    .name("Label if member is a member of BMI")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("isNotMemberOfBmiLabel")
    .name("Label if member is not a member of BMI")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceTitle")
    .name("How you found out about event - Radio group title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceBrochure")
    .name("Radio option if found out through brochure")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceFieldService")
    .name("Radio option if found out through field service")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceWebsite")
    .name("Radio option if found out through BMI website")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceFacebook")
    .name("Radio option if found out through Facebook")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceInstagram")
    .name("Radio option if found out through Instagram")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceXing")
    .name("Radio option if found out through Xing")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceLinkedin")
    .name("Radio option if found out through LinkedIn")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceOther")
    .name("Radio option if found out through other sources")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("discoverySourceSpecifyOther")
    .name("If other source, please specify")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("comment")
    .name("Comment")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("extraParticpantTitle")
    .name("Extra Participant Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("extraParticpantSubtitle")
    .name("Add Extra Participant Sub title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("addParticipantsButton")
    .name("Add Participants button title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("newParticipantTitle")
    .name("New participant title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("removeParticipantButton")
    .name("Remove participant button title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("newParticipantFirstName")
    .name("New participant first name")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("newParticipantLastName")
    .name("New participant last name")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("consentText")
    .name("Consent text")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("termsOfUse")
    .name("Terms Of Use")
    .type("Text")
    .localized(true)
    .required(true);

  trainingRegistrationPage
    .createField("registerButton")
    .name("Register button")
    .type("Symbol")
    .localized(true)
    .required(true);

  const extensions = await getExtensions(context!.makeRequest);

  const slugGenerator = extensions.items.find(
    (item) => item.extension.name === "Slug Generator"
  );

  if (!slugGenerator) {
    throw new Error("Slug Generator Extension was not found");
  }

  trainingRegistrationPage.changeFieldControl(
    "slug",
    "extension",
    slugGenerator.sys.id,
    {
      helpText:
        'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
    }
  );
};

export const down: MigrationFunction = async (migration) => {
  migration.deleteContentType("trainingRegistrationPage");
};
