"use strict";

const ora = require("ora");
const { isDryRun } = require("../../../../utils/process");

module.exports.description =
  "Duplicate the Asset fields in a __deprecated field";

const contentMigrationConfig = [
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
  { sys, fields: { title, description } },
  { currentLocale }
) => ({
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
  assets,
  {
    makeRequest,
    existingImages,
    currentLocale,
    assetToImageMap,
    imageContentType
  }
) => {
  return Promise.all(
    assets.map(async (asset) => {
      if (assetToImageMap[asset.sys.id]) {
        return assetToImageMap[asset.sys.id];
      }

      const assetData = await makeRequest({
        method: "GET",
        url: `/assets/${asset.sys.id}`
      });

      const imageTask = ora(
        `Creating an Image for the asset ${
          assetData.fields.title
            ? assetData.fields.title[currentLocale]
            : asset.sys.id
        }.`
      ).start();

      const data = mapAssetToImage(assetData, { currentLocale });

      const existingImage = existingImages.items.find((item) => {
        return item.fields.image[currentLocale].sys.id === asset.sys.id;
      });

      if (existingImage) {
        assetToImageMap[asset.sys.id] = existingImage;
        imageTask.succeed();

        return existingImage;
      }

      if (isDryRun) {
        imageTask.succeed();
        return { ...data, sys: { id: "1234567890" } };
      }

      const imageEntry = await makeRequest({
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

const getToFieldFromData = (data) => {
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
  migration,
  {
    makeRequest,
    contentType,
    fields,
    assetToImageMap,
    imageContentType,
    existingImages
  }
) => {
  if (!contentType || contentType.fields.find(({ id }) => id === fields.to)) {
    return;
  }

  const editingContentType = migration.editContentType(contentType.sys.id);
  const { name, type, required, localized, validations } =
    contentType.fields.find(({ id }) => id === fields.from);
  const newField = editingContentType
    .createField(fields.to)
    .name(name)
    .type(type)
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
        ...validations.filter(
          (validation) => !("linkMimetypeGroup" in validation)
        )
      ]);
  }

  const { controls } = await makeRequest({
    method: "GET",
    url: `/content_types/${contentType.sys.id}/editor_interface`
  });

  const fieldControl = controls.find(({ fieldId }) => fields.from === fieldId);

  editingContentType.changeFieldControl(
    fields.to,
    "builtin",
    type === "Array" ? "entryCardsEditor" : "entryCardEditor",
    (fieldControl && fieldControl.settings) || {}
  );

  editingContentType.moveField(fields.to).afterField(fields.from);

  migration.transformEntries({
    contentType: contentType.sys.id,
    from: [fields.from],
    to: [fields.to],
    shouldPublish: "preserve",
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const fromField = fromFields[fields.from];

      if (!fromField || !fromField[currentLocale]) {
        return;
      }

      const toField = {
        [fields.to]: getToFieldFromData(
          await createImageFromAssets([fromField[currentLocale]].flat(), {
            makeRequest,
            currentLocale,
            assetToImageMap,
            imageContentType,
            existingImages
          })
        )
      };

      return toField;
    }
  });
};

module.exports.up = async (migration, { makeRequest }) => {
  const task = ora("Retrieving all the Content-Types").start();
  const spaceContentTypes = (
    await makeRequest({
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
  const existingImages = await makeRequest({
    method: "GET",
    url: `/entries?content_type=image`
  });

  for (let contentTypeMigration of contentMigrationConfig) {
    const contentType = spaceContentTypes.find(
      ({ sys }) => sys.id === contentTypeMigration.id
    );

    await transformContentType(migration, {
      makeRequest,
      contentType,
      fields: contentTypeMigration.fields,
      assetToImageMap,
      imageContentType,
      existingImages
    });
  }
};

module.exports.down = async (migration) => {
  for (let contentTypeMigration of contentMigrationConfig) {
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
