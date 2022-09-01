import { isDryRun } from "@bmi-digital/contentful-migration";
import type {
  AssetProps,
  ContentTypeProps,
  CreateEntryProps,
  EditorInterfaceProps,
  EntryProps
} from "contentful-management";
import type Migration from "contentful-migration";
import type {
  FieldType as MigrationFieldType,
  IValidation,
  MakeRequest,
  MigrationContext,
  MigrationFunction
} from "contentful-migration";
import ora from "ora";

export const description = "Duplicate the Asset fields in a __deprecated field";

type ContentMigrationConfig = {
  id: string;
  fields: {
    from:
      | "featuredImage"
      | "previewImage"
      | "image"
      | "profilePicture"
      | "images";
    to: "featuredMedia" | "previewMedia" | "profileImage" | "medias";
  };
};

const contentMigrationConfig: ContentMigrationConfig[] = [
  {
    id: "teamPage",
    fields: {
      from: "featuredImage",
      to: "featuredMedia"
    }
  },
  {
    id: "video",
    fields: {
      from: "previewImage",
      to: "previewMedia"
    }
  },
  {
    id: "promo",
    fields: {
      from: "featuredImage",
      to: "featuredMedia"
    }
  },
  {
    id: "productListerPage",
    fields: {
      from: "featuredImage",
      to: "featuredMedia"
    }
  },
  {
    id: "page",
    fields: {
      from: "featuredImage",
      to: "featuredMedia"
    }
  },
  {
    id: "contactUsPage",
    fields: {
      from: "featuredImage",
      to: "featuredMedia"
    }
  },
  {
    id: "brandLandingPage",
    fields: {
      from: "featuredImage",
      to: "featuredMedia"
    }
  },
  {
    id: "document",
    fields: {
      from: "image",
      to: "featuredMedia"
    }
  },
  {
    id: "teamMember",
    fields: {
      from: "profilePicture",
      to: "profileImage"
    }
  },
  {
    id: "imageGallerySection",
    fields: {
      from: "images",
      to: "medias"
    }
  }
];

const mapAssetToImage = (
  { sys, fields: { title, description } }: AssetProps,
  currentLocale: string
): CreateEntryProps => ({
  fields: {
    title: title,
    caption: description,
    image: {
      [currentLocale]: { sys: { type: "Link", linkType: "Asset", id: sys.id } }
    },
    altText: title,
    type: {
      [currentLocale]: "Decorative"
    }
  }
});

const createImageFromAssets = async (
  assets: AssetProps[],
  makeRequest: MakeRequest,
  currentLocale: string,
  assetToImageMap: Record<string, EntryProps>,
  imageContentType: ContentTypeProps,
  existingImages: EntryProps[]
): Promise<EntryProps[]> => {
  return Promise.all(
    assets.map(async (asset) => {
      if (assetToImageMap[asset.sys.id]) {
        return assetToImageMap[asset.sys.id];
      }

      const assetData: AssetProps = await makeRequest({
        method: "GET",
        url: `/assets/${asset.sys.id}`
      }).items;

      const imageTask = ora(
        `Creating an Image for the asset ${
          assetData.fields.title
            ? assetData.fields.title[currentLocale]
            : asset.sys.id
        }.`
      ).start();

      const data = mapAssetToImage(assetData, currentLocale);

      const existingImage = existingImages.find((item) => {
        return item.fields.image[currentLocale].sys.id === asset.sys.id;
      });

      if (existingImage) {
        assetToImageMap[asset.sys.id] = existingImage;
        imageTask.succeed();

        return existingImage;
      }

      if (isDryRun) {
        imageTask.succeed();
        return {
          ...data,
          sys: {
            id: "1234567890",
            type: "Symbol",
            linkType: "Symbol",
            version: 1,
            createdAt: "0",
            updatedAt: "0",
            space: {
              sys: { id: "1234567890", type: "Symbol", linkType: "Symbol" }
            },
            contentType: {
              sys: { id: "1234567890", type: "Symbol", linkType: "Symbol" }
            },
            environment: {
              sys: { id: "1234567890", type: "Symbol", linkType: "Symbol" }
            }
          }
        };
      }

      const imageEntry: EntryProps = await makeRequest({
        method: "POST",
        url: "/entries",
        data: JSON.stringify(data),
        headers: {
          "X-Contentful-Content-Type": imageContentType.sys.id
        }
      });

      assetToImageMap[asset.sys.id] = imageEntry;

      if (assetData.sys.publishedVersion) {
        await makeRequest({
          method: "PUT",
          url: `/entries/${imageEntry.sys.id}/published`,
          headers: {
            "X-Contentful-Version": 1
          }
        });
      }

      imageTask.succeed();

      return imageEntry;
    })
  );
};

const getToFieldFromData = (data: EntryProps[]) => {
  if (!data.length) {
    return;
  }

  const links = data.map((item) => ({
    sys: {
      type: "Link",
      linkType: "Entry",
      id: item.sys.id
    }
  }));

  if (data.length === 1) {
    return links[0];
  }

  return links;
};

const transformContentType = async (
  migration: Migration,
  makeRequest: MakeRequest,
  contentType: ContentTypeProps,
  fields: ContentMigrationConfig["fields"],
  assetToImageMap: Record<string, EntryProps>,
  imageContentType: ContentTypeProps,
  existingImages: EntryProps[]
) => {
  if (!contentType || contentType.fields.find(({ id }) => id === fields.to)) {
    return;
  }

  const editingContentType = migration.editContentType(contentType.sys.id);
  const field = contentType.fields.find(({ id }) => id === fields.from);
  if (!field) {
    throw Error(
      `Could not find field ${fields.from} on the content type with ID ${contentType.sys.id}`
    );
  }
  const { name, type, required, localized, validations } = field;
  const newField = editingContentType
    .createField(fields.to)
    .name(name)
    .type(type as MigrationFieldType)
    .required(required)
    .localized(localized);

  editingContentType.editField(fields.from).disabled(true).omitted(true);

  if (type === "Array") {
    newField.items({
      type: "Link",
      validations: [
        {
          linkContentType: ["image"]
        }
      ],
      linkType: "Entry"
    });
  } else {
    newField
      .linkType("Entry")
      .validations([
        { linkContentType: ["image"] },
        ...((validations?.filter(
          (validation) => !("linkMimetypeGroup" in validation)
        ) || []) as IValidation[])
      ]);
  }

  const { controls }: EditorInterfaceProps = await makeRequest({
    method: "GET",
    url: `/content_types/${contentType.sys.id}/editor_interface`
  });

  const fieldControl = controls?.find(({ fieldId }) => fields.from === fieldId);

  editingContentType.changeFieldControl(
    fields.to,
    "builtin",
    type === "Array" ? "entryCardsEditor" : "entryCardEditor",
    fieldControl?.settings || {}
  );

  editingContentType.moveField(fields.to).afterField(fields.from);

  migration.transformEntries({
    contentType: contentType.sys.id,
    from: [fields.from],
    to: [fields.to],
    shouldPublish: "preserve",
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const fromField = fromFields[fields.from]?.[currentLocale];

      if (!fromField) {
        return;
      }

      const toField = {
        [fields.to]: getToFieldFromData(
          await createImageFromAssets(
            fromField,
            makeRequest,
            currentLocale,
            assetToImageMap,
            imageContentType,
            existingImages
          )
        )
      };

      return toField;
    }
  });
};

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const task = ora("Retrieving all the Content-Types").start();
  const spaceContentTypes: ContentTypeProps[] = (
    await context!.makeRequest({
      method: "GET",
      url: "/content_types"
    })
  ).items;

  if (!spaceContentTypes.length) {
    throw new Error(
      "No Content-Types containing Assets were found. Is most likely something wrong."
    );
  }

  task.succeed();

  const assetToImageMap = {};
  const imageContentType = spaceContentTypes.find(
    ({ name }) => name === "Image"
  );

  if (!imageContentType) {
    throw Error("Could not find an Image content type");
  }

  const existingImages: EntryProps[] = await context!.makeRequest({
    method: "GET",
    url: `/entries?content_type=image`
  }).items;

  for (const contentTypeMigration of contentMigrationConfig) {
    const contentType = spaceContentTypes.find(
      ({ sys }) => sys.id === contentTypeMigration.id
    );

    if (contentType) {
      await transformContentType(
        migration,
        context!.makeRequest,
        contentType,
        contentTypeMigration.fields,
        assetToImageMap,
        imageContentType,
        existingImages
      );
    }
  }
};

export const down: MigrationFunction = async (migration: Migration) => {
  for (const contentTypeMigration of contentMigrationConfig) {
    const editingContentType = migration.editContentType(
      contentTypeMigration.id
    );

    editingContentType.deleteField(contentTypeMigration.fields.to);
    // In Theory I should migrate it first. In a seperate migration in theory
    editingContentType
      .editField(contentTypeMigration.fields.from)
      .disabled(false)
      .omitted(false);
  }
};
