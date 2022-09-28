/*
  Contentful Management API have limitation to amount of requests
  For more info https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/api-rate-limits
*/
export const CHUNK_SIZE = 10;
export const TIMEOUT = 1000;

/*
  Contentful Management API have limitation to size of bulk operations
  For more info https://www.contentful.com/developers/docs/references/content-management-api/#/reference/bulk-actions
*/
export const BULK_SIZE = 200;

export const KEYS_REQUEST_PAGE_SIZE = 100;
