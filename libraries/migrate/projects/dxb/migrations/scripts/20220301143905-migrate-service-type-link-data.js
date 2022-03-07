"use strict";

const {
  publishEntry,
  createNewEntry,
  getEntrybyNames,
  getAllEntriesByIds,
  getEntriesbyKeys,
  getEntriesbyValues,
  getEntriesbyContentType,
  getLocales
} = require("../../../../utils/makeRequestUtils");

const { camelCase } = require("lodash");
const rooferTypes = require("../../variables/roofer/20211124094158");
const branchTypes = require("../../variables/branchTypes/20210928085352");
const merchantTypes = require("../../variables/merchantTypes/20210929064001");

module.exports.description = "migrate data between roofer and service type";

const createIndexedLookup = async (
  makeRequest,
  microCopyContentTypeId,
  masterList,
  microcopyPrefix,
  defaultLocale
) => {
  let indexedMicroCopies = {};
  if (masterList.length && masterList.length > 0 && masterList.map) {
    const allKeys = masterList
      .map((masterItem) => `${microcopyPrefix}.${camelCase(masterItem)}`)
      .join(",");
    const microcopyResult = await getEntriesbyKeys(
      makeRequest,
      microCopyContentTypeId,
      allKeys
    );

    if (microcopyResult && microcopyResult.total > 0) {
      indexedMicroCopies = microcopyResult.items.reduce(
        (allTransformed, microCopyItem) => {
          return {
            ...allTransformed,
            [microCopyItem.fields.key[defaultLocale]]:
              microCopyItem.fields.value[defaultLocale]
          };
        },
        {}
      );
    }
  }

  return indexedMicroCopies;
};

const generateRooferValueToPrefixKeyPair = (rooferTypes, microcopyPrefix) => {
  if (rooferTypes.length && rooferTypes.length > 0) {
    return rooferTypes.reduce((allValues, rooferType) => {
      return {
        ...allValues,
        [`${microcopyPrefix}.${camelCase(rooferType)}`]: rooferType
      };
    }, {});
  }
  return {};
};

module.exports.up = async (migration, { makeRequest }) => {
  const rooferContentType = migration.editContentType("roofer");
  const serviceTypeContentType = migration.editContentType("serviceType");
  const microCopyContentType = migration.editContentType("resource");

  const rooferTypeMicrocopyPrefix = "findARoofer.filters";
  const branchTypeMicrocopyPrefix = "findABranch.filters";
  const merchantTypeMicrocopyPrefix = "findAMerchant.filters";

  const allLocales = await getLocales(makeRequest);

  let environmentLocale = "en-US";
  if (allLocales && allLocales.total > 0) {
    environmentLocale = allLocales.items[0].code;
  }

  // create indexed master list of translated values of each roofertype, branchType and merchantType
  //create index of ALL types
  const allMicrocopies = {
    ...(await createIndexedLookup(
      makeRequest,
      microCopyContentType.id,
      rooferTypes,
      rooferTypeMicrocopyPrefix,
      environmentLocale
    )),
    ...(await createIndexedLookup(
      makeRequest,
      microCopyContentType.id,
      branchTypes,
      branchTypeMicrocopyPrefix,
      environmentLocale
    )),
    ...(await createIndexedLookup(
      makeRequest,
      microCopyContentType.id,
      merchantTypes,
      merchantTypeMicrocopyPrefix,
      environmentLocale
    ))
  };

  const tryResolveTypeKeyByMicrocopy = (rooferTypeCamelCase) => {
    if (allMicrocopies[`${rooferTypeMicrocopyPrefix}.${rooferTypeCamelCase}`]) {
      return `${rooferTypeMicrocopyPrefix}.${rooferTypeCamelCase}`;
    }
    if (allMicrocopies[`${branchTypeMicrocopyPrefix}.${rooferTypeCamelCase}`]) {
      return `${branchTypeMicrocopyPrefix}.${rooferTypeCamelCase}`;
    }
    if (
      allMicrocopies[`${merchantTypeMicrocopyPrefix}.${rooferTypeCamelCase}`]
    ) {
      return `${merchantTypeMicrocopyPrefix}.${rooferTypeCamelCase}`;
    }

    return rooferTypeCamelCase;
  };

  migration.transformEntries({
    contentType: "roofer",
    from: ["name", "type", "branchType", "merchantType"],
    to: ["serviceTypes"],
    shouldPublish: "preserve",
    transformEntryForLocale: async (
      { name, type, branchType, merchantType },
      currentLocale
    ) => {
      const existingRooferType =
        type && type[currentLocale] ? type[currentLocale] : [];
      const existingBranchType =
        branchType && branchType[currentLocale]
          ? branchType[currentLocale]
          : [];
      const existingMerchantType =
        merchantType && merchantType[currentLocale]
          ? merchantType[currentLocale]
          : [];

      const serviceLinkIdsToLink = await Promise.all(
        [
          ...existingRooferType,
          ...existingBranchType,
          ...existingMerchantType
        ].map(async (rooferType) => {
          const rooferTypeCamelCase = camelCase(rooferType);
          const resolvedKey = tryResolveTypeKeyByMicrocopy(rooferTypeCamelCase);
          const resolvedValue = allMicrocopies[resolvedKey];

          // should we migrate as many entries as possible??
          // if there is an error this will not stop the migration script from falling over
          try {
            //check if the entry already exists with same name in service type!
            let serviceTypeEntry = await getEntrybyNames(
              makeRequest,
              serviceTypeContentType.id,
              [rooferType, resolvedValue].join(",")
            );
            let serviceTypeEntryId = null;
            //create new servicetype entry only if does not exist
            if (
              !serviceTypeEntry ||
              (serviceTypeEntry && serviceTypeEntry.total === 0)
            ) {
              const resultingValue = {
                [environmentLocale]: resolvedValue || rooferType
              };

              serviceTypeEntry = await createNewEntry(
                makeRequest,
                serviceTypeContentType.id,
                {
                  fields: {
                    name: resultingValue
                  }
                }
              );

              serviceTypeEntryId = serviceTypeEntry.sys.id;
              //publish new service type entry
              await publishEntry(
                makeRequest,
                serviceTypeEntryId,
                serviceTypeEntry.sys.version
              );
            } else {
              serviceTypeEntryId = serviceTypeEntry.items[0].sys.id;
            }
            if (serviceTypeEntry) {
              const resultItem = {
                sys: {
                  type: "Link",
                  linkType: "Entry",
                  id: serviceTypeEntryId
                }
              };
              return resultItem;
            }
          } catch (error) {
            console.error(
              `roofer: Something went wrong while migrating : "${name[currentLocale]}" - "${rooferType}"`
            );
            console.error(error);
            return undefined;
          }
        })
      );

      return {
        serviceTypes: [...serviceLinkIdsToLink.filter(Boolean)]
      };
    }
  });

  // disable migrated fields
  rooferContentType.editField("type").disabled(true).omitted(true);
  rooferContentType.editField("branchType").disabled(true).omitted(true);
  rooferContentType.editField("merchantType").disabled(true).omitted(true);
};

module.exports.down = async (migration, { makeRequest }) => {
  const rooferContentType = migration.editContentType("roofer");
  const serviceTypeContentType = migration.editContentType("serviceType");
  const microCopyContentType = migration.editContentType("resource");

  const rooferTypeMicrocopyPrefix = "findARoofer.filters";
  const branchTypeMicrocopyPrefix = "findABranch.filters";
  const merchantTypeMicrocopyPrefix = "findAMerchant.filters";
  const allLocales = await getLocales(makeRequest);

  let environmentLocale = "en-US";
  if (allLocales && allLocales.total > 0) {
    environmentLocale = allLocales.items[0].code;
  }

  const rooferServiceTypesMap = generateRooferValueToPrefixKeyPair(
    rooferTypes,
    rooferTypeMicrocopyPrefix
  );
  const branchServiceTypesMap = generateRooferValueToPrefixKeyPair(
    branchTypes,
    branchTypeMicrocopyPrefix
  );
  const merchantServiceTypesMap = generateRooferValueToPrefixKeyPair(
    merchantTypes,
    merchantTypeMicrocopyPrefix
  );

  //get master list of serviceTypes
  const allServiceTypeEntries = await getEntriesbyContentType(
    makeRequest,
    serviceTypeContentType.id
  );

  let serviceTypeOwnKeyValueMap = {};
  if (allServiceTypeEntries && allServiceTypeEntries.total > 0) {
    serviceTypeOwnKeyValueMap = allServiceTypeEntries.items.reduce(
      (allEntries, serviceTypeEntry) => {
        return {
          ...allEntries,
          [serviceTypeEntry.fields.name[environmentLocale]]:
            serviceTypeEntry.fields.name[environmentLocale]
        };
      },
      {}
    );
  }

  //index them by its labels and get their micro copy

  const microCopyEntriesByValue = await getEntriesbyValues(
    makeRequest,
    microCopyContentType.id,
    Object.values(serviceTypeOwnKeyValueMap).join(",")
  );

  let microCopyValueToKeyMap = {};

  if (microCopyEntriesByValue && microCopyEntriesByValue.total > 0) {
    microCopyValueToKeyMap = microCopyEntriesByValue.items.reduce(
      (allValues, microCopyEntry) => {
        return {
          ...allValues,
          [microCopyEntry.fields.value[environmentLocale]]:
            microCopyEntry.fields.key[environmentLocale]
        };
      },
      {}
    );
  }

  await migration.transformEntries({
    contentType: "roofer",
    from: ["serviceTypes"],
    to: ["type", "branchType", "merchantType"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ serviceTypes }, currentLocale) => {
      const serviceTypeLinks =
        serviceTypes && serviceTypes[currentLocale]
          ? serviceTypes[currentLocale]
          : [];

      const linkedServiceTypeEntries = await getAllEntriesByIds(
        makeRequest,
        serviceTypeContentType.id,
        serviceTypeLinks
          .map((serviceTypeLink) => serviceTypeLink.sys.id)
          .join(",")
      );
      let allLinkedServiceLabels = [];
      if (linkedServiceTypeEntries && linkedServiceTypeEntries.total > 0) {
        //for each label from servicetype entries
        //get microcopy value that matches

        allLinkedServiceLabels = linkedServiceTypeEntries.items.map(
          (linkedServiceType) => {
            return (
              microCopyValueToKeyMap[
                linkedServiceType.fields.name[currentLocale]
              ] || linkedServiceType.fields.name[currentLocale]
            );
          }
        );

        // find out microcopy key for the label
      } else {
        // there are no linked enries
        // nothing to do
        return undefined;
      }

      return {
        type: allLinkedServiceLabels
          .map((ele) => rooferServiceTypesMap[ele])
          .filter(Boolean),
        branchType: allLinkedServiceLabels
          .map((ele) => branchServiceTypesMap[ele])
          .filter(Boolean),
        merchantType: allLinkedServiceLabels
          .map((ele) => merchantServiceTypesMap[ele])
          .filter(Boolean),
        serviceTypes: []
      };
    }
  });

  // enable migrated fields on roofer
  rooferContentType.editField("type").disabled(false).omitted(false);
  rooferContentType.editField("branchType").disabled(false).omitted(false);
  rooferContentType.editField("merchantType").disabled(false).omitted(false);
};
