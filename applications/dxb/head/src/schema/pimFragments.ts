import { graphql } from "gatsby";

export const pimFragments = graphql`
  fragment PIMBrandFragment on Brand {
    code
    name
    logo
  }

  fragment CategoryFragment on Category {
    categoryType
    code
    image {
      ...PIMAssetFragment
    }
    name
    parentCategoryCode
  }

  fragment ClassificationFragment on Classification {
    name
    features {
      name
      value
    }
  }

  fragment PIMAssetFragment on PIMAsset {
    allowedToDownload
    assetType {
      ...AssetTypeFragment
    }
    fileSize
    mime
    name
    realFileName
    url
    format
  }

  fragment PIMImageFragment on PIMImage {
    mainSource
    thumbnail
    altText
  }

  fragment UnitValueFragment on UnitValue {
    value
    unit
  }

  fragment MeasurementsFragment on Measurements {
    length {
      ...UnitValueFragment
    }
    width {
      ...UnitValueFragment
    }
    height {
      ...UnitValueFragment
    }
    thickness {
      ...UnitValueFragment
    }
    volume {
      ...UnitValueFragment
    }
    label
  }

  fragment PIMDocumentFragment on PIMDocument {
    __typename
    title
    url
    assetType {
      ...AssetTypeFragment
    }
    fileSize
    format
    extension
    realFileName
    isLinkDocument
    id
    productBaseCode
    productName
    productCategories {
      code
      parentCategoryCode
    }
  }

  fragment PIMDocumentWithPseudoZipFragment on PIMDocumentWithPseudoZip {
    __typename
    assetType {
      ...AssetTypeFragment
    }
    documentList {
      ...PIMDocumentFragment
    }
    fileSize
    format
    id
    isLinkDocument
    productBaseCode
    productName
  }

  fragment PIMDocumentCommonFragment on ProductDocumentResponse {
    ...PIMDocumentFragment
    ...PIMDocumentWithPseudoZipFragment
  }

  fragment PIMSystemDocumentFragment on PIMSystemDocument {
    __typename
    title
    url
    assetType {
      ...AssetTypeFragment
    }
    fileSize
    format
    realFileName
    isLinkDocument
    id
  }

  fragment PIMVideoFragment on PimVideo {
    __typename
    title
    label
    subtitle
    previewMedia
    videoRatio
    videoUrl
  }
`;
