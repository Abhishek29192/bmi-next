export const GET_MAIN_TILES_QUERY = `
    {
      mainTileCollection(limit: 1000) {
        items {
          code
          sys {
            id
          }
        }
      }
    }
    `;

export const getMainTileQuery = (id: string) => `
          {
            mainTile(id: "${id}") {
              code
              name
              category
              minBattenGauge
              maxBattenGaugeCollection(limit: 20) {
                items {
                  ...RangeValueFragment
                }
              }
              eaveGaugeCollection(limit: 20) {
                items {
                  ...RangeValueFragment
                }
              }
              ridgeSpacingCollection(limit: 20) {
                items {
                  ...RangeValueFragment
                }
              }
              width
              height
              brokenBond
              accessoriesCollection(limit: 50) {
                items {
                  ...AccessoryFragment
                }
              }
              variantsCollection(limit: 20) {
                items {
                  code
                  name
                  image
                  externalProductCode
                  color
                  halfTile {
                    code
                    name
                    externalProductCode
                    image
                    width
                  }
                  hip {
                    ... on RidgeTile {
                      code
                      name
                      externalProductCode
                      image
                      length
                    }
                    ... on HipTile {
                      code
                      name
                      externalProductCode
                      image
                      length
                    }
                    __typename
                  }
                  ridgeOptionsCollection(limit: 20) {
                    items {
                      code
                      name
                      externalProductCode
                      image
                      length
                    }
                  }
                  vergeOptionsCollection(limit: 20) {
                    items {
                      ... on MetalFlushOption {
                        name
                        left {
                          ...VergeMetalFlushFragment
                        }
                        right {
                          ...VergeMetalFlushFragment
                        }
                        leftStart {
                          ...VergeMetalFlushFragment
                        }
                        rightStart {
                          ...VergeMetalFlushFragment
                        }
                      }
                      ... on TileVergeOption {
                        name
                        left {
                          ...VergeTileFragment
                        }
                        right {
                          ...VergeTileFragment
                        }
                        halfLeft {
                          ...HalfVergeTileFragment
                        }
                        halfRight {
                          ...HalfVergeTileFragment
                        }
                      }
                      __typename
                    }
                  }
                  ventilationHoodOptionsCollection(limit: 20) {
                    items {
                      ...AccessoryFragment
                    }
                  }
                  accessoriesCollection(limit: 50) {
                    items {
                      ...AccessoryFragment
                    }
                  }
                  eaveAccessoriesCollection(limit: 50) {
                    items {
                      ...AccessoryFragment
                    }
                  }
                  minBattenGauge
                  maxBattenGaugeCollection(limit: 20) {
                    items {
                      ...RangeValueFragment
                    }
                  }
                  eaveGaugeCollection(limit: 20) {
                    items {
                      ...RangeValueFragment
                    }
                  }
                  ridgeSpacingCollection(limit: 20) {
                    items {
                      ...RangeValueFragment
                    }
                  }
                  width
                  height
                }
              }
            }
          }
          
          fragment VergeMetalFlushFragment on VergeMetalFlush {
            code
            name
            externalProductCode
            image
            length
          }
          
          fragment VergeTileFragment on VergeTile {
            code
            name
            externalProductCode
            image
            width
          }
          
          fragment HalfVergeTileFragment on HalfVergeTile {
            code
            name
            externalProductCode
            image
            width
          }
          
          fragment RangeValueFragment on RangeValue {
            start
            end
            value
          }
          
          fragment AccessoryFragment on Accessory {
            code
            name
            externalProductCode
            packSize
            image
            category
          }      
          `;

export const GET_GUTTERING_RELATED_PRODUCT_QUERY = `
    {
      gutterCollection(limit: 20) {
        items {
          code
          material
          image
          length
          variantsCollection(limit: 20) {
            items {
              code
              name
              externalProductCode
              image
              length
              downPipe {
                ...AccessoryFragment
              }
              downPipeConnector {
                ...AccessoryFragment
              }
            }
          }
        }
      }
      gutterHookCollection(limit: 100) {
        items {
          code
          name
          externalProductCode
          image
          color
          distanceBetweenHooks
        }
      }
    }
    
    fragment AccessoryFragment on Accessory {
      code
      name
      externalProductCode
      packSize
      image
      category
    }
    `;

export const GET_UNDERLAYS_QUERY = `
    {
      underlayCollection(limit:100) {
        items {
          code
          name
          externalProductCode
          image
          shortDescription
          minimumSupportedPitch
          length
          width
          overlap
        }
      }
    }
    `;
