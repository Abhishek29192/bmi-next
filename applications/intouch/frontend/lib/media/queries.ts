import { gql } from "@apollo/client";

export const CONTENTFUL_IMAGE_FRAGMENT = gql`
  fragment ImageFragment on Asset {
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

// export const GET_MEDIA_FOLDER_CONTENTS = gql`
//   query getMediaFolderContents($folderId: Int!) {
//     mediaFolder(id: $folderId) {
//       id
//       childrenCollection {
//         total
//         items {
//           ... on MediaTool {
//             sys {
//               id
//             }
//             name
//             thumbnail {
//               # sys {
//               #   id
//               # }
//               ...ImageFragment
//             }
//             media {
//               # sys {
//               #   id
//               # }
//               ...ImageFragment
//             }
//             description
//             url
//           }

//           ... on MediaFolder {
//             name
//             childrenCollection {
//               total
//               items {
//                 ... on MediaFolder {
//                   sys {
//                     id
//                   }
//                   name
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;
