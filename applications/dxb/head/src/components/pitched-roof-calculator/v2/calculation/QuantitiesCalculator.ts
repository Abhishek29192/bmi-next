import {
  Accessory,
  BaseVariant,
  GutteringVariant,
  LengthBasedProduct,
  MainTileVariant,
  ProductCategory,
  ResultsObject,
  ResultsRow,
  Underlay,
  VergeMetalFlushOption,
  VergeOption,
  VergeTileOption
} from "../../types";
import {
  Face,
  FaceWithBattens,
  Line,
  LinesMap,
  Measurements
} from "../../types/roof";
import { battenCalc, surface } from "./calculate";
import { CONTINGENCY } from "./constants";

export type ProductRowBase = BaseVariant & {
  category?: ProductCategory; // Needed for accessories
};

export type ProductRow = ProductRowBase & {
  category: ProductCategory; // Make it required here
  packSize?: number;
  baseQuantity: number; // Base quantity is quantity before being divided by packSize
};

export const calculateBattensForFaces = (
  faces: Face[],
  mainTileVariant: MainTileVariant
): FaceWithBattens[] =>
  faces.map((face) => ({
    ...face,
    battens: battenCalc(face.vertices, [face.pitch], mainTileVariant)
  }));

export const convertProductRowToResultsRow = ({
  name,
  packSize = 1, // No packs by default
  baseQuantity,
  category,
  externalProductCode,
  image
}: ProductRow): ResultsRow => ({
  category,
  image,
  description: name,
  externalProductCode,
  packSize: packSize === 1 ? "-" : packSize.toString(),
  quantity: Math.ceil(baseQuantity / packSize)
});

const LONG_SCREW_PER_METER = 3.2;
const SCREW_PER_SEQUARE_METER = 10;
const STORM_BRACKET_PER_RIDGE_TILE = 2;

export type QuantitiesCalculatorProps = {
  measurements: Measurements;
  mainTileVariant: MainTileVariant;
  vergeOption?: VergeOption; // Not being provided means using mainTile to fill in verge tiles place
  ridge: LengthBasedProduct;
  ventilationHoods: Accessory[];
  underlay: Underlay;
  gutteringVariant?: GutteringVariant;
  gutteringHook?: LengthBasedProduct;
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

    this.facesBattens = calculateBattensForFaces(faces, mainTileVariant);
    this.addSurfaceCoveringProducts(
      mainTileVariant,
      vergeOption && vergeOption.type === "TILE" ? vergeOption : undefined
    );

    this.lines = lines;
    this.addLineProducts(
      mainTileVariant,
      ridge,
      mainTileVariant.hip,
      vergeOption && vergeOption.type === "METAL_FLUSH"
        ? vergeOption
        : undefined
    );

    this.addVentilationHoods(ventilationHoods);

    this.addGuttering(
      lines.eave,
      gutteringVariant,
      gutteringHook,
      downPipes,
      downPipeConnectors
    );

    this.addCalculatedAccessories(
      measurements,
      mainTileVariant,
      underlay,
      ridge
    );

    this.addOtherAccessories(mainTileVariant.accessories);
  }

  addSurfaceCoveringProducts(
    mainTileVariant: MainTileVariant,
    vergeOption?: VergeTileOption
  ) {
    if (!this.facesBattens) {
      throw new Error(
        `"facesBattens" must be assigned by the constructor before calculating surface covering products`
      );
    }

    this.facesBattens.forEach((faceWithBattens) => {
      const faceTiles = surface(faceWithBattens, mainTileVariant, vergeOption);

      this.addProduct("tiles", mainTileVariant, faceTiles.quantity);

      if (
        mainTileVariant.halfTile &&
        mainTileVariant.brokenBond &&
        faceTiles.half.quantity > 0
      ) {
        this.addProduct(
          "tiles",
          mainTileVariant.halfTile,
          faceTiles.half.quantity
        );
      }

      if (vergeOption) {
        this.addProduct("tiles", vergeOption.left, faceTiles.cloakedVerge.left);
        this.addProduct(
          "tiles",
          vergeOption.right,
          faceTiles.cloakedVerge.right
        );

        if (mainTileVariant.brokenBond) {
          if (faceTiles.cloakedVerge.halfLeft) {
            this.addProduct(
              "tiles",
              vergeOption.halfLeft,
              faceTiles.cloakedVerge.halfLeft
            );
          }

          if (faceTiles.cloakedVerge.halfRight) {
            this.addProduct(
              "tiles",
              vergeOption.halfRight,
              faceTiles.cloakedVerge.halfRight
            );
          }
        }
      }
    });
  }

  addLineProducts(
    mainTileVariant: MainTileVariant,
    ridge: LengthBasedProduct,
    hip: LengthBasedProduct,
    vergeOption?: VergeMetalFlushOption
  ) {
    if (!this.lines) {
      throw new Error(`"lines" must be assigned before calling this function`);
    }

    if (vergeOption) {
      this.addVergeMetalFlush(vergeOption);
    }

    this.addValleyMetalFlush(mainTileVariant);

    this.addLineTilesForLine(this.lines.ridge, ridge);
    this.addLineTilesForLine(this.lines.hip, hip);
  }

  addVergeMetalFlush(vergeOption: VergeMetalFlushOption) {
    this.lines?.leftVerge?.forEach(({ length }) =>
      this.addVergeMetalFlushForLength(
        length,
        vergeOption.left,
        vergeOption.leftStart
      )
    );

    this.lines?.rightVerge?.forEach(({ length }) =>
      this.addVergeMetalFlushForLength(
        length,
        vergeOption.right,
        vergeOption.rightStart
      )
    );
  }

  addVergeMetalFlushForLength(
    length: number,
    metalFlush: LengthBasedProduct,
    metalFlushStart?: LengthBasedProduct
  ) {
    if (metalFlushStart) {
      length -= metalFlushStart.length;
      this.addProduct("accessories", metalFlushStart, 1);
    }

    this.addProduct(
      "accessories",
      metalFlush,
      Math.ceil(length / metalFlush.length)
    );
  }

  addValleyMetalFlush(mainTileVariant: MainTileVariant) {
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
        length -= mainTileVariant.valleyMetalFlushTop.length;
        valleyTopMetalFlushQuantity++;
      }

      if (dormerStart && mainTileVariant.valleyMetalFlushDormerStart) {
        length -= this.addSingleAccessoryWithSubtraction(
          mainTileVariant.valleyMetalFlushDormerStart
        );
      }

      if (mainTileVariant.valleyMetalFlush) {
        this.addProduct(
          "accessories",
          mainTileVariant.valleyMetalFlush,
          Math.ceil(length / mainTileVariant.valleyMetalFlush.length)
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
        "accessories",
        mainTileVariant.valleyMetalFlushTop,
        valleyTopMetalFlushQuantity / 2
      );
    }
  }

  // Returns how much to subtrat from length
  addSingleAccessoryWithSubtraction(accessory: LengthBasedProduct) {
    this.addProduct("accessories", accessory, 1);
    return accessory.length;
  }

  addLineTilesForLine(line: Line[], tileProduct: LengthBasedProduct) {
    line.forEach(({ length }) =>
      this.addLengthBasedProduct("tiles", tileProduct, length)
    );
  }

  addLengthBasedProduct(
    category: ProductCategory,
    product: LengthBasedProduct,
    length: number
  ) {
    this.addProduct(category, product, Math.ceil(length / product.length));
  }

  addVentilationHoods(ventilationHoods: Accessory[]) {
    ventilationHoods.forEach((item) =>
      this.addProduct(
        item.category /* Should be 'ventilation', but this allows for exceptions */,
        item,
        1
      )
    );
  }

  addGuttering(
    eave: Line[],
    gutteringVariant?: GutteringVariant,
    gutteringHook?: LengthBasedProduct,
    downPipes = 0,
    downPipeConnectors = 0
  ) {
    eave.forEach(({ length }) => {
      if (gutteringVariant) {
        this.addLengthBasedProduct("accessories", gutteringVariant, length);
      }

      if (gutteringHook) {
        this.addLengthBasedProduct("accessories", gutteringHook, length);
      }
    });

    if (gutteringVariant) {
      this.addProduct("accessories", gutteringVariant.downpipe, downPipes);
      this.addProduct(
        "accessories",
        gutteringVariant.downpipeConnector,
        downPipeConnectors
      );
    }
  }

  addCalculatedAccessories(
    { lines, area }: Measurements,
    mainTileVariant: MainTileVariant,
    underlay: Underlay,
    ridge: LengthBasedProduct
  ) {
    const ridgeTiles = this.getProductQuantity(ridge.code);
    const hipTiles = this.getProductQuantity(mainTileVariant.hip.code);

    if (mainTileVariant.clip) {
      this.addProduct("fixings", mainTileVariant.clip, ridgeTiles + hipTiles);
    }

    if (mainTileVariant.ridgeAndHipScrew) {
      this.addProduct(
        "fixings",
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

      this.addProduct("fixings", mainTileVariant.longScrew, longScrews);
    }

    if (mainTileVariant.screw) {
      this.addProduct(
        "fixings",
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
      mainTileVariant.stormBracket &&
      ridge.externalProductCode === "25762568"
    ) {
      this.addProduct(
        "fixings",
        mainTileVariant.stormBracket,
        ridgeTiles * STORM_BRACKET_PER_RIDGE_TILE
      );
    }

    if (mainTileVariant.finishingKit) {
      this.addProduct("fixings", mainTileVariant.finishingKit, 1);
    }

    this.addProduct(
      "accessories",
      underlay,
      area
        ? Math.ceil(
            area / (underlay.length * (underlay.width - underlay.overlap))
          )
        : 0
    );

    lines.eave.forEach(({ length }) =>
      mainTileVariant.eaveAccessories.forEach((accessory) =>
        this.addProduct(
          accessory.category,
          accessory,
          Math.ceil(length / 1000) // These are calculated as one per eave meter
        )
      )
    );
  }

  addOtherAccessories(accessories: Accessory[]) {
    accessories.forEach((accessory) => {
      if (accessory.category === "sealing") {
        this.addProduct("sealing", accessory, 0);
        return;
      }

      this.addProduct("accessories", accessory, 0);
    });
  }

  getProductQuantity(code: string) {
    return (this.results.get(code) || {}).baseQuantity || 0;
  }

  addProduct(
    category: ProductCategory,
    product: ProductRowBase,
    baseQuantity: number
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
      ...product,
      category,
      baseQuantity: Math.ceil(
        (oldBaseQuantity + baseQuantity) *
          (category === "tiles" ? 1 + CONTINGENCY : 1)
      )
    };

    this.results.set(product.code, newMapProduct);
  }

  // Those have quantity as the number of packs
  getResultsRowsByCategory(): ResultsObject {
    const result: ResultsObject = {
      tiles: [],
      fixings: [],
      sealing: [],
      ventilation: [],
      accessories: []
    };

    this.results.forEach((product) =>
      result[product.category].push(convertProductRowToResultsRow(product))
    );

    return result;
  }
}

export default QuantitiesCalculator;
