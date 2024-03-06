import {
  Accessory,
  BaseVariant,
  BasicResults,
  GutterHook,
  GutterVariant,
  LengthBasedProduct,
  ProductCategory,
  ResultsRow,
  RidgeOption,
  Tile,
  Underlay,
  VentilationHood,
  VergeOption,
  WidthBasedProduct
} from "../types";
import {
  Face,
  FaceWithBattens,
  Line,
  LinesMap,
  Measurements
} from "../types/roof";
import { battenCalc, surface } from "./calculate";
import { CONTINGENCY } from "./constants";

type Products =
  | Accessory
  | Tile
  | GutterVariant
  | GutterHook
  | Underlay
  | LengthBasedProduct
  | WidthBasedProduct
  | VentilationHood;

export type ProductRowBase = BaseVariant & {
  category?: ProductCategory; // Needed for accessories
};

export type ProductRow = {
  name: string;
  code: string;
  externalProductCode: string;
  image?: string;
  category: ProductCategory;
  packSize?: number;
  baseQuantity: number; // Base quantity is quantity before being divided by packSize
  withContingency: boolean;
};

export const calculateBattensForFaces = (
  faces: Face[],
  mainTileVariant: Tile
): FaceWithBattens[] =>
  faces.map((face) => ({
    ...face,
    battens: battenCalc(face.vertices, mainTileVariant)
  }));

export const convertProductRowToResultsRow = (
  {
    name,
    packSize = 1, // No packs by default
    baseQuantity,
    category,
    externalProductCode,
    image,
    withContingency
  }: ProductRow,
  contingency = 0
): ResultsRow => ({
  category,
  image,
  description: name,
  externalProductCode,
  packSize: packSize === 1 ? "-" : packSize.toString(),
  quantity: Math.ceil(
    Math.ceil(baseQuantity / packSize) * (withContingency ? 1 + contingency : 1)
  )
});

const LONG_SCREW_PER_METER = 3.2;
const SCREW_PER_SEQUARE_METER = 10;
const STORM_BRACKET_PER_RIDGE_TILE = 2;

export type QuantitiesCalculatorProps = {
  measurements: Measurements;
  mainTileVariant?: Tile;
  vergeOption?: VergeOption; // Not being provided means using mainTile to fill in verge tiles place
  ridge: RidgeOption;
  ventilationHoods: VentilationHood[];
  underlay?: Underlay;
  gutteringVariant?: GutterVariant;
  gutteringHook?: GutterHook;
  downPipes?: number;
  downPipeConnectors?: number;
};

// TODO: add some JS docs for the class methods + a separate test file.
class QuantitiesCalculator {
  results = new Map<string, ProductRow>(); // The key is the product "code"
  facesBattens?: FaceWithBattens[];
  lines?: LinesMap;

  constructor({
    measurements,
    mainTileVariant,
    vergeOption,
    ridge,
    ventilationHoods,
    underlay,
    gutteringVariant,
    gutteringHook,
    downPipes,
    downPipeConnectors
  }: QuantitiesCalculatorProps) {
    const { faces, lines } = measurements;

    if (mainTileVariant) {
      this.facesBattens = calculateBattensForFaces(faces, mainTileVariant);
      this.addSurfaceCoveringProducts(mainTileVariant, vergeOption);

      this.lines = lines;
      this.addLineProducts(mainTileVariant, ridge, mainTileVariant.hip);

      this.addVentilationHoods(ventilationHoods);

      this.addCalculatedAccessories(
        measurements,
        mainTileVariant,
        underlay,
        ridge
      );

      this.addOtherAccessories(mainTileVariant.accessories);
    }

    this.addGuttering(
      lines.eave,
      gutteringVariant,
      gutteringHook,
      downPipes,
      downPipeConnectors
    );

    if (underlay) {
      this.addProduct(
        ProductCategory.Accessories,
        underlay,
        measurements.area
          ? Math.ceil(
              measurements.area /
                (underlay.length * (underlay.width - underlay.overlap))
            )
          : 0
      );
    }
  }

  addSurfaceCoveringProducts(mainTileVariant: Tile, vergeOption?: VergeOption) {
    if (!this.facesBattens) {
      throw new Error(
        `"facesBattens" must be assigned by the constructor before calculating surface covering products`
      );
    }

    const hasHalfLeftVerges =
      mainTileVariant.brokenBond &&
      vergeOption?.halfLeft &&
      this.facesBattens.some(({ sides }) => sides[0] === "VERGE");

    const hasHalfRightVerges =
      mainTileVariant.brokenBond &&
      vergeOption?.halfRight &&
      this.facesBattens.some(({ sides }) => sides[1] === "VERGE");

    this.facesBattens.forEach((faceWithBattens) => {
      const faceTiles = surface(
        faceWithBattens,
        mainTileVariant,
        hasHalfLeftVerges,
        hasHalfRightVerges,
        vergeOption
      );

      this.addProduct(
        ProductCategory.Tiles,
        mainTileVariant,
        faceTiles.quantity
      );

      if (mainTileVariant.halfTile && faceTiles.half.quantity) {
        this.addProduct(
          ProductCategory.Tiles,
          mainTileVariant.halfTile,
          faceTiles.half.quantity
        );
      }

      if (vergeOption) {
        this.addProduct(
          ProductCategory.Tiles,
          vergeOption.left,
          faceTiles.cloakedVerge.left
        );
        this.addProduct(
          ProductCategory.Tiles,
          vergeOption.right,
          faceTiles.cloakedVerge.right
        );

        if (mainTileVariant.brokenBond) {
          if (faceTiles.cloakedVerge.halfLeft && vergeOption.halfLeft) {
            this.addProduct(
              ProductCategory.Tiles,
              vergeOption.halfLeft,
              faceTiles.cloakedVerge.halfLeft
            );
          }

          if (faceTiles.cloakedVerge.halfRight && vergeOption.halfRight) {
            this.addProduct(
              ProductCategory.Tiles,
              vergeOption.halfRight,
              faceTiles.cloakedVerge.halfRight
            );
          }
        }
      }
    });
  }

  addLineProducts(
    mainTileVariant: Tile,
    ridge?: RidgeOption,
    hip?: LengthBasedProduct
  ) {
    if (!this.lines) {
      throw new Error(`"lines" must be assigned before calling this function`);
    }

    this.addValleyMetalFlush(mainTileVariant);

    if (ridge) {
      this.addLineTilesForLine(this.lines.ridge, ridge);

      if (ridge.tRidge) {
        this.addProduct(ProductCategory.Tiles, ridge.tRidge, 0);
      }
      if (ridge.yRidge) {
        this.addProduct(ProductCategory.Tiles, ridge.yRidge, 0);
      }
      if (ridge.ridgeEnd) {
        this.addProduct(ProductCategory.Tiles, ridge.ridgeEnd, 0);
      }
    }

    if (hip) {
      this.addLineTilesForLine(this.lines.hip, hip);
    }
  }

  addValleyMetalFlush(mainTileVariant: Tile) {
    let valleyTopMetalFlushQuantity = 0;
    this.lines?.valley?.forEach(({ length, start, end, top, dormerStart }) => {
      if (start && mainTileVariant.valleyMetalFlushStart) {
        length -= this.addSingleAccessoryWithSubtraction(
          mainTileVariant.valleyMetalFlushStart
        );
      }

      if (end && mainTileVariant.valleyMetalFlushEnd) {
        length -= this.addSingleAccessoryWithSubtraction(
          mainTileVariant.valleyMetalFlushEnd
        );
      }

      if (top && mainTileVariant.valleyMetalFlushTop) {
        // Count double the needed quantity of top metal flush then divide later
        length -= mainTileVariant.valleyMetalFlushTop.coverLength;
        valleyTopMetalFlushQuantity++;
      }

      if (dormerStart && mainTileVariant.valleyMetalFlushDormerStart) {
        length -= this.addSingleAccessoryWithSubtraction(
          mainTileVariant.valleyMetalFlushDormerStart
        );
      }

      if (mainTileVariant.valleyMetalFlush) {
        this.addProduct(
          ProductCategory.Accessories,
          mainTileVariant.valleyMetalFlush,
          Math.ceil(length / mainTileVariant.valleyMetalFlush.coverLength)
        );
      }
    });

    if (mainTileVariant.valleyMetalFlushTop && valleyTopMetalFlushQuantity) {
      if (valleyTopMetalFlushQuantity % 2) {
        throw new Error(
          "There is an odd number of lines needing top valley metal flush which is used as only one per pair"
        );
      }

      this.addProduct(
        ProductCategory.Accessories,
        mainTileVariant.valleyMetalFlushTop,
        valleyTopMetalFlushQuantity / 2
      );
    }
  }

  // Returns how much to subtrat from length
  addSingleAccessoryWithSubtraction(accessory: LengthBasedProduct) {
    this.addProduct(ProductCategory.Accessories, accessory, 1);
    return accessory.coverLength;
  }

  addLineTilesForLine(line: Line[], tileProduct: LengthBasedProduct) {
    line.forEach(({ length }) =>
      this.addLengthBasedProduct(ProductCategory.Tiles, tileProduct, length)
    );
  }

  addLengthBasedProduct(
    category: ProductCategory,
    product: LengthBasedProduct,
    length: number
  ) {
    this.addProduct(category, product, Math.ceil(length / product.coverLength));
  }

  addVentilationHoods(ventilationHoods: VentilationHood[]) {
    ventilationHoods.forEach((item) =>
      this.addProduct(ProductCategory.Ventilation, item, 1, false)
    );
  }

  addGuttering(
    eave: Line[],
    gutteringVariant?: GutterVariant,
    gutteringHook?: GutterHook,
    downPipes = 0,
    downPipeConnectors = 0
  ) {
    eave.forEach(({ length }) => {
      if (gutteringVariant) {
        this.addProduct(
          ProductCategory.Accessories,
          gutteringVariant,
          Math.ceil(length / gutteringVariant.length)
        );
      }

      if (gutteringHook) {
        this.addProduct(
          ProductCategory.Accessories,
          gutteringHook,
          Math.ceil(length / gutteringHook.length)
        );
      }
    });

    if (gutteringVariant?.downPipe) {
      this.addProduct(
        ProductCategory.Accessories,
        gutteringVariant.downPipe,
        downPipes
      );
    }

    if (gutteringVariant?.downPipeConnector) {
      this.addProduct(
        ProductCategory.Accessories,
        gutteringVariant.downPipeConnector,
        downPipeConnectors
      );
    }
  }

  addCalculatedAccessories(
    { lines, area }: Measurements,
    mainTileVariant: Tile,
    underlay?: Underlay,
    ridge?: RidgeOption
  ) {
    const ridgeTiles = this.getProductQuantity(ridge?.code);
    const hipTiles = this.getProductQuantity(mainTileVariant.hip?.code);

    if (mainTileVariant.clip && ridgeTiles) {
      this.addProduct(
        ProductCategory.Fixings,
        mainTileVariant.clip,
        ridgeTiles + hipTiles
      );
    }

    if (mainTileVariant.ridgeAndHipScrew && ridgeTiles) {
      this.addProduct(
        ProductCategory.Fixings,
        mainTileVariant.ridgeAndHipScrew,
        ridgeTiles + hipTiles
      );
    }

    let longScrews = 0;

    if (mainTileVariant.longScrew) {
      const hipMeters = lines.hip.reduce((acc, v) => acc + v.length, 0) / 100;
      const ridgeMeters =
        lines.ridge.reduce((acc, v) => acc + v.length, 0) / 100;
      const eaveMeters = lines.eave.reduce((acc, v) => acc + v.length, 0) / 100;
      const leftVergeMeters =
        lines.leftVerge.reduce((acc, v) => acc + v.length, 0) / 100;
      const rightVergeMeters =
        lines.rightVerge.reduce((acc, v) => acc + v.length, 0) / 100;

      longScrews = Math.ceil(
        (hipMeters +
          ridgeMeters +
          eaveMeters +
          leftVergeMeters +
          rightVergeMeters) *
          LONG_SCREW_PER_METER
      );

      this.addProduct(
        ProductCategory.Fixings,
        mainTileVariant.longScrew,
        longScrews
      );
    }

    if (mainTileVariant.screw) {
      this.addProduct(
        ProductCategory.Fixings,
        mainTileVariant.screw,
        area
          ? Math.ceil(
              (area / 10000) /* area in meters */ * SCREW_PER_SEQUARE_METER -
                longScrews
            )
          : 0
      );
    }

    if (
      ridgeTiles &&
      mainTileVariant.stormBracket &&
      ridge.externalProductCode === "25762568"
    ) {
      this.addProduct(
        ProductCategory.Fixings,
        mainTileVariant.stormBracket,
        ridgeTiles * STORM_BRACKET_PER_RIDGE_TILE
      );
    }

    if (mainTileVariant.finishingKit) {
      this.addProduct(
        ProductCategory.Fixings,
        mainTileVariant.finishingKit,
        1,
        false
      );
    }

    lines.eave.forEach(({ length }) =>
      mainTileVariant.eaveAccessories.forEach((accessory) => {
        const category = accessory.category?.toLowerCase() as ProductCategory;
        this.addProduct(
          Object.values(ProductCategory).includes(category)
            ? category
            : ProductCategory.Accessories,
          accessory,
          Math.ceil(length / 1000) // These are calculated as one per eave meter
        );
      })
    );
  }

  addOtherAccessories(accessories: Accessory[]) {
    accessories.forEach((accessory) => {
      if (accessory.category?.toLowerCase() === ProductCategory.Sealing) {
        this.addProduct(ProductCategory.Sealing, accessory, 0);
        return;
      }

      this.addProduct(ProductCategory.Accessories, accessory, 0);
    });
  }

  getProductQuantity(code: string) {
    return (this.results.get(code) || {}).baseQuantity || 0;
  }

  addProduct(
    category: ProductCategory,
    product: Products,
    baseQuantity: number,
    withContingency = true
  ) {
    const productFromMap = this.results.get(product.code);

    if (productFromMap && productFromMap.category !== category) {
      throw new Error(
        `Product of code: ${product.code} is being added to two different category`
      );
    }

    const { baseQuantity: oldBaseQuantity = 0, ...otherCurrentProductProps } =
      productFromMap || {};

    const newMapProduct: ProductRow = {
      ...otherCurrentProductProps,
      image: product.mainImage,
      code: product.code,
      externalProductCode: product.externalProductCode,
      name: product.name,
      packSize: product.packSize,
      category,
      baseQuantity: oldBaseQuantity + baseQuantity,
      withContingency
    };

    this.results.set(product.code, newMapProduct);
  }

  // Those have quantity as the number of packs
  getResultsRowsByCategory(): BasicResults {
    const result: BasicResults = {
      tiles: [],
      fixings: [],
      sealing: [],
      ventilation: [],
      accessories: []
    };

    this.results.forEach((product) =>
      result[product.category].push(
        convertProductRowToResultsRow(product, CONTINGENCY)
      )
    );

    return result;
  }
}

export default QuantitiesCalculator;
