import { gql } from "@apollo/client";

export const CONTENTFUL_IMAGE_FRAGMENT = gql`
  fragment ImageFragment on Asset {
    sys {
      id
    }
    title
    description
    contentType
    fileName
    size
    url
    width
    height
  }
`;

export const GET_MEDIA_FOLDERS = gql`
  query getMediaFolders {
    marketContentCollection(limit: 1) {
      items {
        mediaLibraryRootCollection {
          items {
            sys {
              id
            }
            name
          }
        }
      }
    }
    mediaFolderCollection {
      total
      items {
        sys {
          id
        }
        name
        childrenCollection {
          total
          items {
            ... on MediaFolder {
              __typename
              sys {
                id
              }
              name
            }
            ... on MediaTool {
              __typename
              sys {
                id
              }
              name
            }
          }
        }
      }
    }
  }
`;

export const CONTENTFUL_MEDIA_TOOL_DETAILS_FRAGMENT = gql`
  fragment MediaToolDetails on MediaTool {
    __typename
    sys {
      id
    }
    name
    media {
      ...ImageFragment
    }
    thumbnail {
      ...ImageFragment
    }
    url
  }
`;

export const GET_MEDIA_ITEM_BY_ID = gql`
  # we could either be retrieving a Media Folder or a Media Tool
  query getMediaItemById($mediaItemId: String!) {
    # we need a collection because Contentful will throw an error if it doesn't find the item by id
    mediaFolderCollection(where: { sys: { id: $mediaItemId } }, limit: 1) {
      items {
        sys {
          id
        }
        name
        childrenCollection {
          total
          items {
            ... on MediaTool {
              __typename
              sys {
                id
              }
              name
              thumbnail {
                ...ImageFragment
              }
              media {
                ...ImageFragment
              }
              url
            }

            ... on MediaFolder {
              __typename
              sys {
                id
              }
              name
            }
          }
        }
      }
    }

    # we need a collection because Contentful will throw an error if it doesn't find the item by id
    mediaToolCollection(where: { sys: { id: $mediaItemId } }, limit: 1) {
      items {
        sys {
          id
        }
        name
        media {
          ...ImageFragment
        }
        thumbnail {
          ...ImageFragment
        }
        url
      }
    }
  }
`;
