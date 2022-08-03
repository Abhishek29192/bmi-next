import {
  createNewEntry,
  getAllEntriesByIds,
  getEntriesByContentType,
  getEntriesByKeys,
  getEntriesByValues,
  getEntryByNames,
  getLocales,
  publishEntry
} from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type {
  MakeRequest,
  MigrationContext,
  MigrationFunction
} from "contentful-migration";
import { camelCase } from "lodash";
import branchTypes from "../../variables/branchTypes/20210928085352";
import merchantTypes from "../../variables/merchantTypes/20210929064001";
import rooferTypes from "../../variables/roofer/20211124094158";

export const description = "migrate data between roofer and service type";

const createIndexedLookup = async (
  makeRequest: MakeRequest,
  microCopyContentTypeId: string,
  masterList: string[],
  microcopyPrefix: string,
  defaultLocale: string
): Promise<Record<string, string>> => {
  if (!masterList.length || masterList.length === 0) {
    return {};
  }

  const allKeys = masterList.map(
    (masterItem) => `${microcopyPrefix}.${camelCase(masterItem)}`
  );
  const microcopyResult = await getEntriesByKeys(
    makeRequest,
    microCopyContentTypeId,
    allKeys
  );

  if (!microcopyResult || microcopyResult.total === 0) {
    return {};
  }

  return microcopyResult.items.reduce<Record<string, string>>(
    (allTransformed, microCopyItem) => {
      return {
        ...allTransformed,
        [microCopyItem.fields.key[defaultLocale]]:
          microCopyItem.fields.value[defaultLocale]
      };
    },
    {}
  );
};

const generateRooferValueToPrefixKeyPair = (
  rooferTypes: string[],
  microcopyPrefix: string
): Record<string, string> => {
  if (!rooferTypes.length || rooferTypes.length === 0) {
    return {};
  }
  return rooferTypes.reduce(
    (allValues, rooferType) => ({
      ...allValues,
      [`${microcopyPrefix}.${camelCase(rooferType)}`]: rooferType
    }),
    {}
  );
};

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const rooferContentType = migration.editContentType("roofer");
  const serviceTypeContentType = migration.editContentType("serviceType");
  const microCopyContentType = migration.editContentType("resource");

  const rooferTypeMicrocopyPrefix = "findARoofer.filters";
  const branchTypeMicrocopyPrefix = "findABranch.filters";
  const merchantTypeMicrocopyPrefix = "findAMerchant.filters";

  const allLocales = await getLocales(context!.makeRequest);

  let environmentLocale = "en-US";
  if (allLocales && allLocales.total > 0) {
    environmentLocale = allLocales.items[0].code;
  }

  // create indexed master list of translated values of each roofertype, branchType and merchantType
  //create index of ALL types
  const allMicrocopies = {
    ...(await createIndexedLookup(
      context!.makeRequest,
      microCopyContentType.id,
      rooferTypes,
      rooferTypeMicrocopyPrefix,
      environmentLocale
    )),
    ...(await createIndexedLookup(
      context!.makeRequest,
      microCopyContentType.id,
      branchTypes,
      branchTypeMicrocopyPrefix,
      environmentLocale
    )),
    ...(await createIndexedLookup(
      context!.makeRequest,
      microCopyContentType.id,
      merchantTypes,
      merchantTypeMicrocopyPrefix,
      environmentLocale
    ))
  };

  const tryResolveTypeKeyByMicrocopy = (rooferTypeCamelCase: string) => {
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
      const existingRooferType: any =
        type && type[currentLocale] ? type[currentLocale] : [];
      const existingBranchType =
        branchType && branchType[currentLocale]
          ? branchType[currentLocale]
          : [];
      const existingMerchantType: any =
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
            const existingServiceTypeEntry = await getEntryByNames(
              context!.makeRequest,
              serviceTypeContentType.id,
              [rooferType, resolvedValue]
            );
            let serviceTypeEntryId = null;
            //create new servicetype entry only if does not exist
            if (
              !existingServiceTypeEntry ||
              (existingServiceTypeEntry && existingServiceTypeEntry.total === 0)
            ) {
              const resultingValue = {
                [environmentLocale]: resolvedValue || rooferType
              };

              const serviceTypeEntry = await createNewEntry(
                context!.makeRequest,
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
                context!.makeRequest,
                serviceTypeEntryId,
                serviceTypeEntry.sys.version
              );
            } else {
              serviceTypeEntryId = existingServiceTypeEntry.items[0].sys.id;
            }
            const resultItem = {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: serviceTypeEntryId
              }
            };
            return resultItem;
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

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const rooferContentType = migration.editContentType("roofer");
  const serviceTypeContentType = migration.editContentType("serviceType");
  const microCopyContentType = migration.editContentType("resource");

  const rooferTypeMicrocopyPrefix = "findARoofer.filters";
  const branchTypeMicrocopyPrefix = "findABranch.filters";
  const merchantTypeMicrocopyPrefix = "findAMerchant.filters";
  const allLocales = await getLocales(context!.makeRequest);

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
  const allServiceTypeEntries = await getEntriesByContentType(
    context!.makeRequest,
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

  const microCopyEntriesByValue = await getEntriesByValues(
    context!.makeRequest,
    microCopyContentType.id,
    Object.values(serviceTypeOwnKeyValueMap)
  );

  let microCopyValueToKeyMap: Record<string, string> = {};

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
        context!.makeRequest,
        serviceTypeContentType.id,
        serviceTypeLinks.map((serviceTypeLink: any) => serviceTypeLink.sys.id)
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
