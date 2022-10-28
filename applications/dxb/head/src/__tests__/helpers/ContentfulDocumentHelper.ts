import { ContentfulDocument as ContentfulDocumentData } from "../../types/Document";
import createAssetType from "./AssetTypeHelper";

const createContentfulDocument = (
  pimDocument?: Partial<ContentfulDocumentData>
): ContentfulDocumentData => ({
  __typename: "ContentfulDocument",
  id: "contentful-document-id",
  title: "contentful-document-title",
  assetType: createAssetType(),
  featuredMedia: {
    type: "Decorative",
    altText: "alt text",
    focalPoint: {
      x: 0,
      y: 0
    },
    image: {
      file: {
        fileName: "image.jpg",
        url: "http://doesnot-exist.com/image.jpg"
      },
      gatsbyImageData: {
        images: {
          sources: [
            {
              srcSet:
                "//doesnot-exist.com/image.jpg?w=1296&h=864&q=50&fm=webp 1296w,\n//doesnot-exist.com/image.jpg?w=2592&h=1728&q=50&fm=webp 2592w,\n//doesnot-exist.com/image.jpg?w=4000&h=2666&q=50&fm=webp 4000w",
              sizes: "(min-width: 5184px) 5184px, 100vw",
              type: "image/webp"
            }
          ],
          fallback: {
            src: "//doesnot-exist.com/image.jpg?w=1296&h=864&fl=progressive&q=50&fm=jpg",
            srcSet:
              "//doesnot-exist.com/image.jpg?w=1296&h=864&fl=progressive&q=50&fm=jpg 1296w,\n//doesnot-exist.com/image.jpg?w=2592&h=1728&fl=progressive&q=50&fm=jpg 2592w,\n//doesnot-exist.com/image.jpg?w=4000&h=2666&fl=progressive&q=50&fm=jpg 4000w",
            sizes: "(min-width: 5184px) 5184px, 100vw"
          }
        },
        layout: "constrained",
        backgroundColor: "#f8f8f8",
        width: 5184,
        height: 3456
      }
    }
  },
  asset: {
    file: {
      url: "http://doesnot-exist.com/fileName",
      fileName: `fileName`,
      contentType: "image/jpg",
      details: {
        size: 89898
      }
    }
  },
  description: null,
  brand: null,
  noIndex: false,
  ...pimDocument
});

export default createContentfulDocument;
