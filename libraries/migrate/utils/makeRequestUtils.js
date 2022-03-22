"use strict";

module.exports = {
  getEntrybyNames: async (makeRequest, contentTypeId, names) => {
    return await makeRequest({
      method: "GET",
      url: `/entries?content_type=${contentTypeId}&fields.name[in]=${names}`
    });
  },

  getAllEntriesByIds: async (makeRequest, contentTypeId, Ids) => {
    return await makeRequest({
      method: "GET",
      url: `/entries?content_type=${contentTypeId}&sys.id[in]=${Ids}`
    });
  },

  getEntriesbyKeys: async (makeRequest, contentTypeId, keys) => {
    return await makeRequest({
      method: "GET",
      url: `/entries?content_type=${contentTypeId}&fields.key[in]=${keys}`
    });
  },

  getEntriesbyValues: async (makeRequest, contentTypeId, values) => {
    return await makeRequest({
      method: "GET",
      url: `/entries?content_type=${contentTypeId}&fields.value[in]=${values}`
    });
  },
  getEntriesbyContentType: async (makeRequest, contentTypeId) => {
    return await makeRequest({
      method: "GET",
      url: `/entries?content_type=${contentTypeId}`
    });
  },
  getLocales: async (makeRequest) => {
    return await makeRequest({
      method: "GET",
      url: `/locales`
    });
  },
  createNewEntry: async (makeRequest, contentTypeId, payload) => {
    return await makeRequest({
      method: "POST",
      url: `/entries`,
      headers: {
        "X-Contentful-Content-Type": contentTypeId
      },
      data: JSON.stringify(payload)
    });
  },
  publishEntry: async (makeRequest, entryId, entryVersion) => {
    await makeRequest({
      method: "PUT",
      url: `/entries/${entryId}/published`,
      headers: {
        "X-Contentful-Version": entryVersion
      }
    });
  },
  unpublishEntry: async (makeRequest, entryId, version) => {
    const deleted = await makeRequest({
      method: "DELETE",
      url: `/entries/${entryId}/published`,
      headers: {
        "X-Contentful-Version": version
      }
    });
    return deleted;
  },
  deleteEntry: async (makeRequest, entryId, version) => {
    const deleted = await makeRequest({
      method: "DELETE",
      url: `/entries/${entryId}`,
      headers: {
        "X-Contentful-Version": version
      }
    });
    return deleted;
  }
};
