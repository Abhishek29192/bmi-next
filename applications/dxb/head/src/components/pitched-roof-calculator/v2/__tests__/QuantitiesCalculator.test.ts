import mockConsole from "jest-mock-console";
import { createProduct } from "../../helpers/products";
import { ProductCategory, ResultsRow } from "../../types";
import { Measurements } from "../../types/roof";
import {
  Accessory,
  GutterHook,
  GutterVariant,
  LengthBasedProduct,
  RidgeOption,
  Tile,
  Underlay,
  VentilationHood,
  VergeVariant,
  WidthBasedProduct
} from "../../types/v2";
import QuantitiesCalculator, {
  convertProductRowToResultsRow,
  QuantitiesCalculatorProps
} from "../calculation/QuantitiesCalculator";

beforeAll(() => {
  mockConsole();
});

const vergeHalfLeftTile = createProduct<VergeVariant>({
  code: "849702122_Zanda_Protector_verge_half_tile_black_left",
  name: "Zanda_Protector_verge half tile black left",
  externalProductCode: "87035763",
  mainImage: "",
  width: 15
});

const vergeHalfRightTile = createProduct<VergeVariant>({
  code: "849702122_Zanda_Protector_verge_half_tile_black_right",
  name: "Zanda_Protector_verge half tile black right",
  externalProductCode: "87035764",
  mainImage: "",
  width: 15
});

const vergeLeftTile = createProduct<VergeVariant>({
  code: "849702122_Zanda_Protector_verge_tile_black_left",
  name: "Zanda_Protector_verge tile black left",
  externalProductCode: "87035761",
  mainImage: "",
  width: 30
});

const vergeRightTile = createProduct<VergeVariant>({
  code: "849702122_Zanda_Protector_verge_tile_black_right",
  name: "Zanda_Protector_verge tile black right",
  externalProductCode: "87035762",
  mainImage: "",
  width: 30
});

const input: QuantitiesCalculatorProps = {
  measurements: {
    faces: [
      {
        vertices: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 482.01524713666305
          },
          {
            x: 1500,
            y: 482.01524713666305
          },
          {
            x: 1500,
            y: 0
          }
        ],
        pitch: 21,
        sides: ["VERGE", "VERGE"]
      },
      {
        vertices: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 482.01524713666305
          },
          {
            x: 1500,
            y: 482.01524713666305
          },
          {
            x: 1500,
            y: 0
          }
        ],
        pitch: 21,
        sides: ["VERGE", "VERGE"]
      }
    ],
    lines: {
      hip: [],
      ridge: [
        {
          length: 1500
        }
      ],
      eave: [
        {
          length: 900
        },
        {
          length: 900
        },
        {
          length: 1500
        },
        {
          length: 1500
        }
      ],
      leftVerge: [
        {
          length: 482.01524713666305
        },
        {
          length: 482.01524713666305
        }
      ],
      rightVerge: [
        {
          length: 482.01524713666305
        },
        {
          length: 482.01524713666305
        }
      ],
      valley: []
    },
    area: 1446045.741409989
  },
  mainTileVariant: {
    ...createProduct<Tile>({
      code: "175200122_Zanda_Protector_main_tile_black",
      name: "Zanda Protector main tile black",
      externalProductCode: "46035712",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      color: "Black"
    }),
    halfTile: createProduct<WidthBasedProduct>({
      code: "275102122_Zanda_Protector_half_tile_black",
      name: "Zanda Protector half tile black",
      externalProductCode: "46035795",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      width: 18
    }),
    hip: createProduct<LengthBasedProduct>({
      code: "249702122_Zanda_Protector_ridge_tile_black",
      name: "Zanda_Protector_ridge tile black",
      externalProductCode: "46035761",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 33.33
    }),
    ridgeOptions: [
      createProduct<RidgeOption>({
        code: "249702122_Zanda_Protector_ridge_tile_black",
        name: "Zanda_Protector_ridge tile black",
        externalProductCode: "46035761",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        length: 33.33
      }),
      createProduct<RidgeOption>({
        code: "249702122_Zanda_Protector_SAMPLE_RIDGE_METAL_FLUSH",
        name: "Zanda_Protector_ridge sample metal flush black",
        externalProductCode: "46035001",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        length: 33.33
      })
    ],
    vergeOption: {
      left: createProduct<VergeVariant>({
        code: "849702122_Zanda_Protector_verge_metal_flush_black_left",
        name: "Zanda_Protector_verge metal flush black left",
        externalProductCode: "86035761",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        length: 10
      }),
      right: createProduct<VergeVariant>({
        code: "849702122_Zanda_Protector_verge_metal_flush_black_right",
        name: "Zanda_Protector_verge metal flush black right",
        externalProductCode: "86035762",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        length: 10
      }),
      leftStart: createProduct<VergeVariant>({
        code: "849702122_Zanda_Protector_verge_metal_flush_black_left_start",
        name: "Zanda_Protector_verge metal flush black left start",
        externalProductCode: "86035763",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        length: 10
      }),
      rightStart: createProduct<VergeVariant>({
        code: "849702122_Zanda_Protector_verge_metal_flush_black_right_start",
        name: "Zanda_Protector_verge metal flush black right start",
        externalProductCode: "86035764",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        length: 10
      })
    },
    valleyMetalFlushStart: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_start",
      name: "Zanda_Protector_valley metal flush black start",
      externalProductCode: "66035761",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 19
    }),
    valleyMetalFlush: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black",
      name: "Zanda_Protector_valley metal flush black",
      externalProductCode: "66035762",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 19
    }),
    valleyMetalFlushEnd: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_end",
      name: "Zanda_Protector_valley metal flush black end",
      externalProductCode: "66035763",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 19
    }),
    valleyMetalFlushTop: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_top",
      name: "Zanda_Protector_valley metal flush black top",
      externalProductCode: "66035764",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 19
    }),
    valleyMetalFlushDormerStart: createProduct<LengthBasedProduct>({
      code: "669702122_Zanda_Protector_valley_metal_flush_black_dormer_start",
      name: "Zanda_Protector_valley metal flush black dormer start",
      externalProductCode: "66035765",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 19
    }),
    accessories: [
      createProduct<Accessory>({
        code: "Other",
        name: "Other accesories example",
        externalProductCode: "5555550",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        category: ProductCategory.Accessories,
        packSize: 2
      })
    ],
    eaveAccessories: [
      createProduct<Accessory>({
        code: "Fuglelist_ventilert",
        name: "Fuglelist ventilert",
        externalProductCode: "5555551",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
        category: ProductCategory.Accessories
      })
    ],
    clip: createProduct<Accessory>({
      code: "clip",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
      name: "Clips",
      externalProductCode: "113456781",
      category: ProductCategory.Accessories
    }),
    ridgeAndHipScrew: createProduct<Accessory>({
      code: "ridgeAndHipScrew",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
      name: "Ridge and Hip Screw",
      externalProductCode: "113456782",
      category: ProductCategory.Accessories
    }),
    longScrew: createProduct<Accessory>({
      code: "longScrew",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
      name: "Long Screw",
      externalProductCode: "113456783",
      category: ProductCategory.Accessories
    }),
    screw: createProduct<Accessory>({
      code: "screw",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
      name: "Screw",
      externalProductCode: "113456784",
      category: ProductCategory.Accessories
    }),
    stormBracket: createProduct<Accessory>({
      code: "stormBracket",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
      name: "Storm Bracket",
      externalProductCode: "113456785",
      category: ProductCategory.Accessories
    }),
    finishingKit: createProduct<Accessory>({
      code: "finishingKit",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
      name: "Finishing Kit",
      externalProductCode: "113456786",
      category: ProductCategory.Accessories
    }),
    ventilationHoodOptions: [
      createProduct<VentilationHood>({
        code: "vho1",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
        name: "Ventilation Hood 1",
        externalProductCode: "100456781",
        category: ProductCategory.Ventilation
      }),
      createProduct<VentilationHood>({
        code: "vho2",
        mainImage:
          "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
        name: "Ventilation Hood 2",
        externalProductCode: "100456782",
        category: ProductCategory.Ventilation
      })
    ],
    minBattenSpacing: 31,
    maxBattenSpacing: 31,
    eaveGauge: 38,
    ridgeSpacing: 5,
    width: 33.2,
    height: 42,
    brokenBond: true
  },
  vergeOption: {
    left: createProduct<VergeVariant>({
      code: "849702122_Zanda_Protector_verge_metal_flush_black_left",
      name: "Zanda_Protector_verge metal flush black left",
      externalProductCode: "86035761",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 10
    }),
    right: createProduct<VergeVariant>({
      code: "849702122_Zanda_Protector_verge_metal_flush_black_right",
      name: "Zanda_Protector_verge metal flush black right",
      externalProductCode: "86035762",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 10
    }),
    leftStart: createProduct<VergeVariant>({
      code: "849702122_Zanda_Protector_verge_metal_flush_black_left_start",
      name: "Zanda_Protector_verge metal flush black left start",
      externalProductCode: "86035763",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 10
    }),
    rightStart: createProduct<VergeVariant>({
      code: "849702122_Zanda_Protector_verge_metal_flush_black_right_start",
      name: "Zanda_Protector_verge metal flush black right start",
      externalProductCode: "86035764",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
      length: 10
    })
  },
  ridge: createProduct<RidgeOption>({
    code: "249702122_Zanda_Protector_ridge_tile_black",
    name: "Zanda_Protector_ridge tile black",
    externalProductCode: "46035761",
    mainImage:
      "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h77/hdc/8975277129758/Product-Hero-Small-Desktop-Tablet-44134186-Icopal-Takshingel-type-S-Kullsortjpg",
    length: 33.33
  }),
  ventilationHoods: [
    createProduct<VentilationHood>({
      code: "vho1",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/ha8/hf4/8975277850654/Product-Hero-Small-Desktop-Tablet-44134160-Icopal-Takshingel-type-S-Teglrodjpg",
      name: "Ventilation Hood 1",
      externalProductCode: "100456781",
      category: ProductCategory.Ventilation
    })
  ],
  underlay: createProduct<Underlay>({
    code: "304910308_Underlay_Divoroll_TOP_RU",
    name: "Underlay Divoroll TOP RU",
    description: "Short underlay description",
    externalProductCode: "26583450",
    mainImage:
      "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/h02/hc4/8975281455134/Product-Hero-Small-Desktop-Tablet-44134232-Icopal-Takshingel-type-S-Teglrod-med-skyggejpg",
    length: 5000,
    width: 150,
    overlap: 0
  }),
  gutteringVariant: createProduct<GutterVariant>({
    code: "Test_Guttering_Black",
    name: "Test Guttering Black",
    externalProductCode: "34391",
    mainImage:
      "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/hc6/h4b/8975279292446/Product-Hero-Small-Desktop-Tablet-44134213-Icopal-Takshingel-type-S-Skiferjpg",
    length: 600,
    downPipe: createProduct<Accessory>({
      code: "Downpipe",
      name: "Downpipe",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/hc6/h4b/8975279292446/Product-Hero-Small-Desktop-Tablet-44134213-Icopal-Takshingel-type-S-Skiferjpg",
      externalProductCode: "33332",
      category: ProductCategory.Accessories
    }),
    downPipeConnector: createProduct<Accessory>({
      code: "Downpipe_Connector",
      name: "Downpipe Connector",
      mainImage:
        "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/hc6/h4b/8975279292446/Product-Hero-Small-Desktop-Tablet-44134213-Icopal-Takshingel-type-S-Skiferjpg",
      externalProductCode: "33331",
      category: ProductCategory.Accessories
    })
  }),
  gutteringHook: createProduct<GutterHook>({
    code: "Test_Guttering_Hook_Black",
    name: "Test Guttering Hook Black",
    externalProductCode: "34392",
    mainImage:
      "https://bmipimngprodtfe.azureedge.net/sys-master-hybris-media/hc6/h4b/8975279292446/Product-Hero-Small-Desktop-Tablet-44134213-Icopal-Takshingel-type-S-Skiferjpg",
    length: 400
  }),
  downPipes: 3,
  downPipeConnectors: 2
};

const roof2: Measurements = {
  faces: [
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 900,
          y: 482.01524713666305
        },
        {
          x: 900,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VERGE"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 900,
          y: 482.01524713666305
        },
        {
          x: 900,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VERGE"]
    },
    {
      vertices: [
        {
          x: 150,
          y: 0
        },
        {
          x: 0,
          y: 160.67174904555435
        },
        {
          x: 350,
          y: 160.67174904555435
        },
        {
          x: 350,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VALLEY", "VERGE"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 160.67174904555435
        },
        {
          x: 350,
          y: 160.67174904555435
        },
        {
          x: 200,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VALLEY"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 150,
          y: 57.579605255312366
        },
        {
          x: 300,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VALLEY", "VALLEY"],
      subtract: true
    }
  ],
  lines: {
    hip: [],
    ridge: [
      {
        length: 900
      }
    ],
    eave: [
      {
        length: 900
      },
      {
        length: 900
      },
      {
        length: 900
      },
      {
        length: 900
      },
      {
        length: 200
      },
      {
        length: 200
      }
    ],
    leftVerge: [
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      },
      {
        length: 160.67174904555435
      }
    ],
    rightVerge: [
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      },
      {
        length: 160.67174904555435
      }
    ],
    valley: [
      {
        length: 219.80766806769412,
        top: true,
        start: true
      },
      {
        length: 219.80766806769412,
        top: true,
        start: true
      }
    ]
  },
  area: 964633.8476093452
};

const roof3: Measurements = {
  faces: [
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 1300,
          y: 482.01524713666305
        },
        {
          x: 1300,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VERGE"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 1300,
          y: 482.01524713666305
        },
        {
          x: 1300,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VERGE"]
    },
    {
      vertices: [
        {
          x: 450,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 650,
          y: 482.01524713666305
        },
        {
          x: 650,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VALLEY", "VERGE"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 650,
          y: 482.01524713666305
        },
        {
          x: 200,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VALLEY"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 450,
          y: 172.7388157659371
        },
        {
          x: 900,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VALLEY", "VALLEY"],
      subtract: true
    }
  ],
  lines: {
    hip: [],
    ridge: [
      {
        length: 1300
      }
    ],
    eave: [
      {
        length: 900
      },
      {
        length: 900
      },
      {
        length: 1300
      },
      {
        length: 1300
      },
      {
        length: 200
      },
      {
        length: 200
      }
    ],
    leftVerge: [
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      }
    ],
    rightVerge: [
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      }
    ],
    valley: [
      {
        length: 659.4230042030823,
        end: true,
        start: true
      },
      {
        length: 659.4230042030823,
        end: true,
        start: true
      }
    ]
  },
  area: 1740685.069716159
};

const roof6: Measurements = {
  faces: [
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 1500,
          y: 482.01524713666305
        },
        {
          x: 1500,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VERGE"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 482.01524713666305
        },
        {
          x: 1500,
          y: 482.01524713666305
        },
        {
          x: 1500,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VERGE"]
    },
    {
      vertices: [
        {
          x: 250,
          y: 0
        },
        {
          x: 0,
          y: 267.78624840925727
        },
        {
          x: 200,
          y: 267.78624840925727
        },
        {
          x: 200,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VALLEY", "VERGE"]
    },
    {
      vertices: [
        {
          x: 250,
          y: 0
        },
        {
          x: 0,
          y: 267.78624840925727
        },
        {
          x: 200,
          y: 267.78624840925727
        },
        {
          x: 200,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VERGE", "VALLEY"]
    },
    {
      vertices: [
        {
          x: 0,
          y: 0
        },
        {
          x: 250,
          y: 95.96600875885395
        },
        {
          x: 500,
          y: 0
        }
      ],
      pitch: 21,
      sides: ["VALLEY", "VALLEY"],
      subtract: true
    }
  ],
  lines: {
    hip: [],
    ridge: [
      {
        length: 1500
      },
      {
        length: 200
      }
    ],
    eave: [
      {
        length: 900
      },
      {
        length: 900
      },
      {
        length: 1500
      },
      {
        length: 1500
      },
      {
        length: -50
      },
      {
        length: -50
      }
    ],
    leftVerge: [
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      },
      {
        length: 267.78624840925727
      }
    ],
    rightVerge: [
      {
        length: 482.01524713666305
      },
      {
        length: 482.01524713666305
      },
      {
        length: 267.78624840925727
      }
    ],
    valley: [
      {
        length: 366.3461134461569,
        dormerStart: true,
        end: true
      },
      {
        length: 366.3461134461569,
        dormerStart: true,
        end: true
      }
    ]
  },
  area: 1510205.1808610912
};

describe("PitchedRoofCalculator QuantitiesCalculator", () => {
  it("calculates with metal flush verge", () => {
    const calculator = new QuantitiesCalculator(input);
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("calculates without half tile", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      mainTileVariant: { ...input.mainTileVariant, halfTile: undefined }
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("calculates with verge tile", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      vergeOption: {
        halfLeft: vergeHalfLeftTile,
        halfRight: vergeHalfRightTile,
        left: vergeLeftTile,
        right: vergeRightTile
      }
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("calculates with metal flush verge and valley", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      measurements: roof3
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("calculates with metal flush verge and valley with no valley metal flush", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      measurements: roof3,
      mainTileVariant: {
        ...input.mainTileVariant,
        valleyMetalFlush: undefined,
        valleyMetalFlushDormerStart: undefined,
        valleyMetalFlushEnd: undefined,
        valleyMetalFlushStart: undefined,
        valleyMetalFlushTop: undefined
      }
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("calculates with metal flush verge and valley with no calcualted accessories", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      measurements: roof3,
      mainTileVariant: {
        ...input.mainTileVariant,
        clip: undefined,
        ridgeAndHipScrew: undefined,
        longScrew: undefined,
        screw: undefined,
        stormBracket: undefined,
        finishingKit: undefined
      }
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("calculates with metal flush verge and valley with top", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      measurements: roof2
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("calculates with metal flush verge and valley with dormer start", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      measurements: roof6
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("addValleyMetalFlush throws if there is an odd number of lines needing top tile", () => {
    const newInput = {
      ...input,
      measurements: {
        ...roof2,
        lines: {
          ...roof2.lines,
          valley: [
            ...roof2.lines.valley,
            {
              length: 200,
              top: true
            }
          ]
        }
      }
    };

    expect(() => {
      new QuantitiesCalculator(newInput);
    }).toThrow(
      "There is an odd number of lines needing top valley metal flush which is used as only one per pair"
    );
  });

  it("throws if the same product is being added to two different categories", () => {
    const calculator = new QuantitiesCalculator(input);

    expect(() => {
      calculator.addProduct(
        ProductCategory.Ventilation,
        input.mainTileVariant,
        5
      );
    }).toThrow(
      `Product of code: ${input.mainTileVariant.code} is being added to two different category`
    );
  });

  it("calculates with stormBracket", () => {
    const calculator = new QuantitiesCalculator({
      ...input,
      ridge: { ...input.ridge, externalProductCode: "25762568" }
    });
    const results = calculator.getResultsRowsByCategory();

    expect(results).toMatchSnapshot();
  });

  it("getProductQuantity returns 0 if product is not found", () => {
    const calculator = new QuantitiesCalculator(input);

    expect(calculator.getProductQuantity("some-non-existent-product")).toEqual(
      0
    );
  });

  it("addSurfaceCoveringProducts throws if faceBattens aren't calculated", () => {
    const calculator = Object.create(QuantitiesCalculator.prototype);
    expect(() => {
      calculator.addSurfaceCoveringProducts(input.mainTileVariant);
    }).toThrow(
      `"facesBattens" must be assigned by the constructor before calculating surface covering products`
    );
  });

  it("addLineProducts throws if faceBattens aren't calculated", () => {
    const calculator = Object.create(QuantitiesCalculator.prototype);
    expect(() => {
      calculator.addLineProducts(
        input.mainTileVariant,
        input.ridge,
        input.mainTileVariant.hip
      );
    }).toThrow(`"lines" must be assigned before calling this function`);
  });

  it("convertProductRowToResultsRow defaults to no contingency", () => {
    const calculator = new QuantitiesCalculator(input);

    const results: ResultsRow[] = [];

    calculator.results.forEach((product) => {
      results.push(convertProductRowToResultsRow(product));
    });

    expect(results).toMatchSnapshot();
  });

  it("returns data for all ridges", () => {
    const tRidge = createProduct<LengthBasedProduct>({
      code: "275213122_Zanda_Protector_T_ridge_black",
      name: "Zanda Protector T-møne",
      externalProductCode: "46035833",
      mainImage:
        "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h93/h6b/9003661230110/Product-Color-Selector-Mobile-Zanda-Protector-T-monejpg",
      length: 35
    });
    const yRidge = createProduct<LengthBasedProduct>({
      code: "275215122_Zanda_Protector_Y_ridge_black",
      name: "Zanda Protector valmtetning",
      externalProductCode: "46035897",
      mainImage:
        "https://bmipimngqa.azureedge.net/sys-master-hybris-media/he1/hcd/9003550212126/Product-Color-Selector-Mobile-275215122-Concrete-Y-Ridge-Protector20-Blackjpg",
      length: 25
    });
    const ridgeEnd = createProduct<LengthBasedProduct>({
      code: "275216122_Zanda_Protector_ridge_end_black",
      name: "Zanda Protector møneavslutning",
      externalProductCode: "46035920",
      mainImage:
        "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hb2/h24/9003659788318/Product-Color-Selector-Mobile-Zanda-Protector-moneavslutningjpg",
      length: 25
    });

    const calculator = new QuantitiesCalculator({
      ...input,
      ridge: { ...input.ridge, tRidge, yRidge, ridgeEnd }
    });
    expect(calculator.results.get(tRidge.code)).toBeTruthy();
    expect(calculator.results.get(yRidge.code)).toBeTruthy();
    expect(calculator.results.get(ridgeEnd.code)).toBeTruthy();
  });

  it("returns data without half tiles", () => {
    const calculations = new QuantitiesCalculator({
      ...input,
      mainTileVariant: { ...input.mainTileVariant, brokenBond: false },
      vergeOption: {
        halfLeft: vergeHalfLeftTile,
        halfRight: vergeHalfRightTile,
        left: vergeLeftTile,
        right: vergeRightTile
      }
    });

    expect(calculations.results.get(vergeHalfLeftTile.code)).toBeUndefined();
    expect(calculations.results.get(vergeHalfRightTile.code)).toBeUndefined();
    expect(
      calculations.results.get(input.mainTileVariant.halfTile.code)
    ).toBeUndefined();
  });

  it("returns correct data for VERGE faces", () => {
    const calculations = new QuantitiesCalculator({
      ...input,
      measurements: {
        ...input.measurements,
        faces: input.measurements.faces.map((face) => ({
          ...face,
          sides: ["VERGE", "VERGE"]
        }))
      },
      mainTileVariant: { ...input.mainTileVariant, brokenBond: true },
      vergeOption: {
        halfLeft: vergeHalfLeftTile,
        halfRight: vergeHalfRightTile,
        left: vergeLeftTile,
        right: vergeRightTile
      }
    });

    expect(calculations.results.get(vergeHalfLeftTile.code)).toBeTruthy();
    expect(calculations.results.get(vergeHalfRightTile.code)).toBeTruthy();
    expect(
      calculations.results.get(input.mainTileVariant.halfTile.code)
    ).toBeUndefined();
  });

  it("returns correct data for VALLEY faces", () => {
    const calculations = new QuantitiesCalculator({
      ...input,
      measurements: {
        ...input.measurements,
        faces: input.measurements.faces.map((face) => ({
          ...face,
          sides: ["VALLEY", "VALLEY"]
        }))
      },
      mainTileVariant: { ...input.mainTileVariant, brokenBond: true },
      vergeOption: {
        halfLeft: vergeHalfLeftTile,
        halfRight: vergeHalfRightTile,
        left: vergeLeftTile,
        right: vergeRightTile
      }
    });

    expect(calculations.results.get(vergeHalfLeftTile.code)).toBeUndefined();
    expect(calculations.results.get(vergeHalfRightTile.code)).toBeUndefined();
    expect(
      calculations.results.get(input.mainTileVariant.halfTile.code)
    ).toBeTruthy();
  });
});
