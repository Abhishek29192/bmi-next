import { MetadataProps } from "contentful-management";

const createMetadataProps = (
  metadataProps?: Partial<MetadataProps>
): MetadataProps => ({
  tags: [],
  ...metadataProps
});

export default createMetadataProps;
