import { getApp, removeAppFromSpace } from "@bmi-digital/contentful-migration";
import { CreateAppDefinitionProps } from "contentful-management";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description =
  "Install the image focal point app and create the Image Content-Type";

const imageFocalPointAppDefinition: CreateAppDefinitionProps = {
  name: "Image Focal Point",
  src: "https://focal-point.ctfapps.net",
  locations: [
    { location: "app-config" },
    { location: "dialog" },
    { location: "entry-field", fieldTypes: [{ type: "Object" }] }
  ]
};

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const { sys } = await getApp(imageFocalPointAppDefinition, context!);
  const image = migration
    .createContentType("image")
    .name("Image")
    .displayField("title")
    .description("Wrapper around the image Asset.");

  image.createField("title").name("Title").type("Symbol").required(true);

  image
    .createField("image")
    .name("Image")
    .type("Link")
    .linkType("Asset")
    .validations([{ linkMimetypeGroup: ["image"] }]);

  image
    .createField("type")
    .name("Type")
    .type("Symbol")
    .validations([
      {
        in: ["Decorative", "Descriptive"]
      }
    ]);

  image.createField("focalPoint").name("Focal point").type("Object");

  image
    .createField("altText")
    .name("Alternative text")
    .type("Symbol")
    .required(true);

  image.createField("caption").name("Caption").type("Text");

  image.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "Used for identifying item in contentful only"
  });
  image.changeFieldControl("focalPoint", "app", sys.id, {
    helpText:
      'Select the focal point of the image. Note: only works for images of type "Decorative"'
  });
  image.changeFieldControl("type", "builtin", "radio", {
    helpText:
      "The decorative images (in situation or visually appealing) will fill the container it is used on and will crop based on the device and size, whereas descriptive images (product, icons, logos, technical drawings) will always be contained in the space so that the entire image is visible on all devices and sizes."
  });
  image.changeFieldControl("caption", "builtin", "multipleLine");
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  migration.deleteContentType("image");

  removeAppFromSpace(imageFocalPointAppDefinition.name, context!);
};
