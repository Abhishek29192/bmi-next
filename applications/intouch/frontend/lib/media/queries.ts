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

export const GET_MEDIA_FOLDER_CONTENTS = gql`
  query getMediaFolderContents($folderId: String!) {
    mediaFolder(id: $folderId) {
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
`;
