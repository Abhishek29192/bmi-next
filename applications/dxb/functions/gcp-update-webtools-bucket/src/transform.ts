import Joi from "joi";
import {
  Accessory,
  BaseProduct,
  BaseTile,
  BaseVariant,
  Guttering,
  GutteringVariant,
  LengthBasedProduct,
  MainTile,
  MainTileVariant,
  RangeValue,
  Underlay,
  VergeMetalFlushOption,
  VergeOption,
  VergeTileOption,
  WidthBasedProduct
} from "./types";

type OneValueFunction = (v: any) => any;
const returnSelf = (v: any) => v;

const validate =
  (schema: Joi.ObjectSchema<any>, preprocess: (v: any) => any) =>
  (value: any) => {
    const result = schema.validate(preprocess(value));

    if (result.error) {
      throw new Error(result.error.details[0].message);
    }

    return result.value;
  };

const optional = (value: any, fn: OneValueFunction) =>
  value ? fn(value) : undefined;

const getNumber = (value: number, fallback: number | null | undefined) =>
  typeof value === "number" ? value : optional(fallback, returnSelf);

type Collection = { items: any[] };

const mapItems = (a: Collection, fn: OneValueFunction, fallback: Collection) =>
  a.items.length ? a.items.map(fn) : fallback.items.map(fn);

const baseProductValidator = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required()
});

const getBaseProduct = (product: any): BaseProduct => ({
  code: product.code,
  name: product.name
});

const baseVariantValidator = baseProductValidator.append({
  externalProductCode: Joi.string().required(),
  image: Joi.string().required()
});

const getBaseVariant = (variant: any): BaseVariant => ({
  ...getBaseProduct(variant),
  externalProductCode: variant.externalProductCode,
  image: variant.image
});

const lengthBasedProductValidator = baseVariantValidator.append({
  length: Joi.number().required()
});

const getLengthBasedProduct = (variant: any): LengthBasedProduct => ({
  ...getBaseVariant(variant),
  length: variant.length
});

const widthBasedProductValidator = baseVariantValidator.append({
  width: Joi.number().required()
});

const getWidthBasedProduct = (variant: any): WidthBasedProduct => ({
  ...getBaseVariant(variant),
  width: variant.width
});

const vergeMetalFlushOptionValidator = Joi.object({
  type: Joi.string().valid("METAL_FLUSH").required(),
  name: Joi.string().required(),
  left: lengthBasedProductValidator.required(),
  right: lengthBasedProductValidator.required(),
  leftStart: lengthBasedProductValidator,
  rightStart: lengthBasedProductValidator
}).required();

const getVergeMetalFlushOption = (option: any): VergeMetalFlushOption => ({
  type: "METAL_FLUSH",
  name: option.name,
  left: getLengthBasedProduct(option.left),
  right: getLengthBasedProduct(option.right),
  leftStart: optional(option.leftStart, getLengthBasedProduct),
  rightStart: optional(option.rightStart, getLengthBasedProduct)
});

const vergeTileOptionValidator = Joi.object({
  type: Joi.string().valid("TILE").required(),
  name: Joi.string().required(),
  left: widthBasedProductValidator.required(),
  right: widthBasedProductValidator.required(),
  halfLeft: widthBasedProductValidator,
  halfRight: widthBasedProductValidator
}).required();

const getVergeTileOption = (option: any): VergeTileOption => ({
  type: "TILE",
  name: option.name,
  left: getWidthBasedProduct(option.left),
  right: getWidthBasedProduct(option.right),
  halfLeft: optional(option.halfLeft, getWidthBasedProduct),
  halfRight: optional(option.halfRight, getWidthBasedProduct)
});

const vergeOptionValidator = Joi.alternatives().try(
  vergeMetalFlushOptionValidator,
  vergeTileOptionValidator
);

type VergeOptionTypes = "MetalFlushOption" | "TileVergeOption";

const getVergeOption = (option: any): VergeOption =>
  ({
    MetalFlushOption: getVergeMetalFlushOption,
    TileVergeOption: getVergeTileOption
  }[option.__typename as VergeOptionTypes](option));

const accessoryValidator = baseVariantValidator.append({
  category: Joi.string()
    .valid("tiles", "fixings", "sealing", "ventilation", "accessories")
    .required(),
  packSize: Joi.number().required()
});

const getAccessory = (variant: any): Accessory => ({
  ...getBaseVariant(variant),
  category: variant.category,
  packSize: variant.packSize || 1
});

const underlayValidator = baseVariantValidator.append({
  description: Joi.string().allow("").required(),
  minSupportedPitch: Joi.number().required(),
  length: Joi.number().required(),
  width: Joi.number().required(),
  overlap: Joi.number().required()
});

const getUnderlay = (product: any): Underlay => ({
  ...getBaseVariant(product),
  description: product.shortDescription || "",
  minSupportedPitch: product.minimumSupportedPitch,
  length: product.length,
  width: product.width,
  overlap: product.overlap
});

const gutteringVariantValidator = lengthBasedProductValidator.append({
  downpipe: accessoryValidator.required(),
  downpipeConnector: accessoryValidator.required()
});

const getGutteringVariant = (variant: any, product: any): GutteringVariant => ({
  ...getLengthBasedProduct({
    ...variant,
    length: variant.length !== null ? variant.length : product.length
  }),
  downpipe: variant.downPipe,
  downpipeConnector: variant.downPipeConnector
});

const gutteringValidator = baseProductValidator.append({
  image: Joi.string().required(),
  variants: Joi.array().items(gutteringVariantValidator).required()
});

const getGuttering = (product: any): Guttering => ({
  ...getBaseProduct({ ...product, name: product.material }),
  image: product.image,
  variants: product.variantsCollection.items.map((variant: any) =>
    getGutteringVariant(variant, product)
  )
});

const gutterHookValidator = lengthBasedProductValidator;

const getGutterHook = (product: any): LengthBasedProduct => ({
  ...getBaseVariant(product),
  length: product.distanceBetweenHooks
});

const rangeValueValidator = Joi.object({
  start: Joi.number().required(),
  end: Joi.number().required(),
  value: Joi.number().required()
});

const getRangeValue = (range: any): RangeValue => ({
  start: range.start,
  end: range.end,
  value: range.value
});

const baseTileSchema = {
  minBattenGauge: Joi.number().required(),
  maxBattenGauge: Joi.array().items(rangeValueValidator).required(),
  eaveGauge: Joi.array().items(rangeValueValidator).required(),
  ridgeSpacing: Joi.array().items(rangeValueValidator).required(),
  width: Joi.number().required(),
  height: Joi.number().required(),
  brokenBond: Joi.boolean().required()
};

const getBaseTile = (variant: any, mainTileProduct: any): BaseTile => ({
  minBattenGauge: getNumber(
    variant.minBattenGauge,
    mainTileProduct.minBattenGauge
  ),
  maxBattenGauge: mapItems(
    variant.maxBattenGaugeCollection,
    getRangeValue,
    mainTileProduct.maxBattenGaugeCollection
  ),
  eaveGauge: mapItems(
    variant.eaveGaugeCollection,
    getRangeValue,
    mainTileProduct.eaveGaugeCollection
  ),
  ridgeSpacing: mapItems(
    variant.ridgeSpacingCollection,
    getRangeValue,
    mainTileProduct.ridgeSpacingCollection
  ),
  width: getNumber(variant.width, mainTileProduct.width),
  height: getNumber(variant.height, mainTileProduct.height),
  brokenBond: Boolean(mainTileProduct.brokenBond)
});

const mainTileVariantValidator = baseVariantValidator.append({
  ...baseTileSchema,
  color: Joi.string().required(),
  halfTile: widthBasedProductValidator,
  hip: lengthBasedProductValidator.required(),
  ridgeOptions: Joi.array().items(lengthBasedProductValidator).required(),
  vergeOptions: Joi.array().items(vergeOptionValidator).required(),
  valleyMetalFlushStart: lengthBasedProductValidator,
  valleyMetalFlush: lengthBasedProductValidator,
  valleyMetalFlushEnd: lengthBasedProductValidator,
  valleyMetalFlushTop: lengthBasedProductValidator,
  valleyMetalFlushDormerStart: lengthBasedProductValidator,
  accessories: Joi.array().items(accessoryValidator).required(),
  eaveAccessories: Joi.array().items(accessoryValidator).required(),
  clip: accessoryValidator,
  ridgeAndHipScrew: accessoryValidator,
  longScrew: accessoryValidator,
  screw: accessoryValidator,
  stormBracket: accessoryValidator,
  finishingKit: accessoryValidator,
  ventilationHoodOptions: Joi.array().items(accessoryValidator).required()
});

const getMainTileVariant = (
  variant: any,
  mainTileProduct: any
): MainTileVariant => ({
  ...getBaseVariant(variant),
  ...getBaseTile(variant, mainTileProduct),
  color: variant.color,
  halfTile: optional(variant.halfTile, getWidthBasedProduct),
  hip: getLengthBasedProduct(variant.hip),
  ridgeOptions: variant.ridgeOptionsCollection.items.map(getLengthBasedProduct),
  vergeOptions: variant.vergeOptionsCollection.items.map(getVergeOption),
  valleyMetalFlushStart: optional(
    variant.valleyMetalFlushStart,
    getLengthBasedProduct
  ),
  valleyMetalFlush: optional(variant.valleyMetalFlush, getLengthBasedProduct),
  valleyMetalFlushEnd: optional(
    variant.valleyMetalFlushEnd,
    getLengthBasedProduct
  ),
  valleyMetalFlushTop: optional(
    variant.valleyMetalFlushTop,
    getLengthBasedProduct
  ),
  valleyMetalFlushDormerStart: optional(
    variant.valleyMetalFlushDormerStart,
    getLengthBasedProduct
  ),
  accessories: mapItems(
    variant.accessoriesCollection,
    getAccessory,
    mainTileProduct.accessoriesCollection
  ),
  eaveAccessories: variant.eaveAccessoriesCollection.items.map(getAccessory),
  clip: optional(variant.clip, getAccessory),
  ridgeAndHipScrew: optional(variant.ridgeAndHipScrew, getAccessory),
  longScrew: optional(variant.longScrew, getAccessory),
  screw: optional(variant.screw, getAccessory),
  stormBracket: optional(variant.stormBracket, getAccessory),
  finishingKit: optional(variant.finishingKit, getAccessory),
  ventilationHoodOptions:
    variant.ventilationHoodOptionsCollection.items.map(getAccessory)
});

const mainTileValidator = baseProductValidator.append({
  ...baseTileSchema,
  category: Joi.string().valid("concrete", "metal", "clay").required(),
  variants: Joi.array().items(mainTileVariantValidator).required()
});

const getMainTile = (product: any): MainTile => ({
  ...getBaseProduct(product),
  ...getBaseTile(product, product),
  category: product.category,
  variants: product.variantsCollection.items.map((variant: any) =>
    getMainTileVariant(variant, product)
  )
});

export const transformMainTileProduct = (product: any): MainTile =>
  validate(mainTileValidator, getMainTile)(product);

export const transformGutteringProduct = (product: any): Guttering =>
  validate(gutteringValidator, getGuttering)(product);

export const transformGutterHookProduct = (product: any): LengthBasedProduct =>
  validate(gutterHookValidator, getGutterHook)(product);

export const transformUnderlayProduct = (product: any): Underlay =>
  validate(underlayValidator, getUnderlay)(product);
