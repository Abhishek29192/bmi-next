import { GetMediaFoldersQuery } from "../../graphql/generated/operations";

export const mockMediaFolderQueryResult: GetMediaFoldersQuery = {
  marketContentCollection: {
    items: [
      {
        mediaLibraryRootCollection: {
          items: [
            {
              __typename: "MediaFolder",
              sys: {
                id: "4nG2CwGJ5HYFjzmTudiKuX"
              },
              name: "Technical Information"
            },
            {
              __typename: "MediaFolder",
              sys: {
                id: "1o5Pj4P3rmpzKhjRQC5gkJ"
              },
              name: "Marketing Tool Kit"
            }
          ]
        }
      }
    ]
  },
  mediaFolderCollection: {
    total: 7,
    items: [
      {
        __typename: "MediaFolder",
        sys: {
          id: "2RdhIZRj7BuTDbC2eO2vQp"
        },
        name: "Gallery",
        childrenCollection: {
          total: 2,
          items: [
            {
              __typename: "MediaTool",
              sys: {
                id: "5KGuESJm1OLfhEkSP9HfTD"
              },
              name: "Toscana Warisan - Black Glazed"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "2TmnqXhVdDMIb4RoY4Xqiv"
              },
              name: "Legacy Mineral - Silverstone Grey"
            }
          ]
        }
      },
      {
        __typename: "MediaFolder",
        sys: {
          id: "1PEb5EJ4v7YNXFc8zoZ8ed"
        },
        name: "Flat Roofing",
        childrenCollection: {
          total: 3,
          items: [
            {
              __typename: "MediaTool",
              sys: {
                id: "3AreaOOZF0GzX8XQjPeXZA"
              },
              name: "BMI Law"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "10WnYMRLoeSuqNND0O5mGH"
              },
              name: "BMI Ulitima"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "5tzcypHzzgzeGBiTzhH84e"
              },
              name: "BMI Everguard"
            }
          ]
        }
      },
      {
        __typename: "MediaFolder",
        sys: {
          id: "4nG2CwGJ5HYFjzmTudiKuX"
        },
        name: "Technical Information",
        childrenCollection: {
          total: 1,
          items: [
            {
              __typename: "MediaFolder",
              sys: {
                id: "4cMlAdSxDHY2S8mrU2jNzL"
              },
              name: "Tiles Specification"
            }
          ]
        }
      },
      {
        __typename: "MediaFolder",
        sys: {
          id: "7uwBeeAddtivDzEH6aEDef"
        },
        name: "Leaflets",
        childrenCollection: {
          total: 3,
          items: [
            {
              __typename: "MediaTool",
              sys: {
                id: "2EhAiBMgtbfS2d8EbVMUU"
              },
              name: "BMI Monier ThermalFoil Delexe Bubble R"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "6v69vlQ4d9oOfVXdGC4nRl"
              },
              name: "Solar Water Heating"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "1zgOu4tti5dqxY1SUeMWI4"
              },
              name: "ThermalFoil Series"
            }
          ]
        }
      },
      {
        __typename: "MediaFolder",
        sys: {
          id: "4cMlAdSxDHY2S8mrU2jNzL"
        },
        name: "Tiles Specification",
        childrenCollection: {
          total: 6,
          items: [
            {
              __typename: "MediaTool",
              sys: {
                id: "22CAX9URDUN1rxH041V5jd"
              },
              name: "Horizon 8"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "4AUyMVzfgZIrLNBhrPD8RX"
              },
              name: "Advanced Contour"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "7a4zQQC1IaIzwVJIlJZ2ts"
              },
              name: "Marseille 12"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "6VvIBL0SX3WJfwNxnNe9Zg"
              },
              name: "Heritage V"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "3sPoHFpBAP7IIyHItLrOXF"
              },
              name: "Elebana"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "2H9GYsnHaV75zBRmqxvxKW"
              },
              name: "Nordica"
            }
          ]
        }
      },
      {
        __typename: "MediaFolder",
        sys: {
          id: "1o5Pj4P3rmpzKhjRQC5gkJ"
        },
        name: "Marketing Tool Kit",
        childrenCollection: {
          total: 7,
          items: [
            {
              __typename: "MediaFolder",
              sys: {
                id: "1PEb5EJ4v7YNXFc8zoZ8ed"
              },
              name: "Flat Roofing"
            },
            {
              __typename: "MediaFolder",
              sys: {
                id: "fMiK6cMWNNqQEvsGTttTb"
              },
              name: "Pitched Roofing"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "4WuF7lqmeYsfG1xfY136B3"
              },
              name: "About BMI"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "4Lj01mNLlQH5LnXEbcRunh"
              },
              name: "Project Focus Image"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "4iB1MxkxJV92RNXW5w8jzH"
              },
              name: "About BMI"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "5CgJQMeKOl9o4NPmkjQVbc"
              },
              name: "Case studies"
            },
            {
              __typename: "MediaTool",
              sys: {
                id: "6iNtFnMG0wrIUEDoNT5t0B"
              },
              name: "Innovation"
            }
          ]
        }
      },
      {
        __typename: "MediaFolder",
        sys: {
          id: "fMiK6cMWNNqQEvsGTttTb"
        },
        name: "Pitched Roofing",
        childrenCollection: {
          total: 2,
          items: [
            {
              __typename: "MediaFolder",
              sys: {
                id: "7uwBeeAddtivDzEH6aEDef"
              },
              name: "Leaflets"
            },
            {
              __typename: "MediaFolder",
              sys: {
                id: "2RdhIZRj7BuTDbC2eO2vQp"
              },
              name: "Gallery"
            }
          ]
        }
      }
    ]
  }
};
