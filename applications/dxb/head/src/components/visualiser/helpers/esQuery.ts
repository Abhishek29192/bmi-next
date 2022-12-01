export const getProductsQuery = () => ({
  size: 100,
  query: {
    bool: {
      must: [
        { match: { "CHANNEL.code.keyword": "VISUALISER" } },
        { exists: { field: "name" } },
        { exists: { field: "TILESATTRIBUTES$VERTICALOVERLAP" } },
        { exists: { field: "TILESATTRIBUTES$HORIZONTALOVERLAP" } },
        { exists: { field: "TILESATTRIBUTES$HORIZONTALOFFSET" } },
        { exists: { field: "GENERALINFORMATION$CLASSIFICATION" } },
        { exists: { field: "APPEARANCEATTRIBUTES$COLOUR" } },
        {
          match: {
            "visualiserAssets.assetType.keyword": "HIGH_DETAIL_MESH_REFERENCE"
          }
        },
        {
          match: {
            "visualiserAssets.assetType.keyword": "LOW_DETAIL_MESH_REFERENCE"
          }
        },
        {
          match: {
            "visualiserAssets.assetType.keyword":
              "METALLIC_ROUGHNESS_MAP_REFERENCE"
          }
        },
        {
          match: {
            "visualiserAssets.assetType.keyword": "RIDGE_REFERENCE"
          }
        },
        {
          match: {
            "visualiserAssets.assetType.keyword": "NORMAL_MAP_REFERENCE"
          }
        },
        {
          match: {
            "visualiserAssets.assetType.keyword": "DIFFUSE_MAP_REFERENCE"
          }
        }
      ]
    }
  }
});
