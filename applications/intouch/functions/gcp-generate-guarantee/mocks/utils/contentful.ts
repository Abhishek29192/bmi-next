import { ContentfulAsset, Entry } from "@bmi/intouch-api-types";

export const mockContentfulEntry = (input?: { id?: string }): Entry => ({
  sys: {
    id: input?.id || "",
    spaceId: "",
    environmentId: ""
  },
  contentfulMetadata: {
    tags: []
  }
});

export const mockContentfulAsset = ({
  id,
  fileName,
  url
}: {
  id?: string;
  fileName?: string;
  url?: string;
}): ContentfulAsset => ({
  ...mockContentfulEntry({ id }),
  fileName,
  url
});
