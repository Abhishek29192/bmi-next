import React, { useContext, useEffect, useMemo, useState } from "react";
import { microCopy } from "../../../constants/microCopies";
import { useConfig } from "../../../contexts/ConfigProvider";
import { devLog } from "../../../utils/devLog";
import { queryElasticSearch } from "../../../utils/elasticSearch";
import { shallowEqual } from "../../../utils/isObjectEqual";
import { useSiteContext } from "../../Site";
import {
  constructQueryForProductReferences,
  getProductsQuery
} from "../helpers/esQueries";
import getPitchValues from "../helpers/getPitchValues";
import {
  getVergeOption,
  prepareProducts,
  transformProductReferences
} from "../helpers/products";
import { CalculatorConfig, CalculatorSteps } from "../types";
import {
  DimensionsValues,
  LinesMap,
  Measurements,
  Protrusion,
  RoofV2 as Roof
} from "../types/roof";
import {
  Data,
  GutteringFormSelection,
  mainTileReferencesMapper,
  NestedProductReferences,
  nestedProductReferencesMapper,
  ReferencedTileProducts,
  Tile,
  TileOptionSelections,
  Underlay
} from "../types/v2";
import { AnalyticsContext } from "./../helpers/analytics";
import { calculateArea } from "./calculation/calculate";
import { CONTINGENCY_PERCENTAGE_TEXT } from "./calculation/constants";
import protrusionTypes from "./calculation/protrusions";
import roofs from "./calculation/roofs";
import CalculatorStepper from "./subcomponents/calculator-stepper/CalculatorStepper";
import Guttering, { GutteringSelections } from "./_Guttering";
import styles from "./_PitchedRoofCalculatorSteps.module.scss";
import Results from "./_Results";
import RoofDimensions from "./_RoofDimensions";
import RoofSelection from "./_RoofSelection";
import TileOptions from "./_TileOptions";
import TileSelection from "./_TileSelection";
import UnderlaySelection from "./_UnderlaySelection";
import VariantSelection from "./_VariantSelection";

export type PitchedRoofCalculatorStepsProps = {
  isDebugging?: boolean;
  selected: CalculatorSteps;
  setSelected: (value: CalculatorSteps) => void;
  calculatorConfig: CalculatorConfig | null;
};

const PitchedRoofCalculatorSteps = ({
  isDebugging,
  selected,
  setSelected,
  calculatorConfig
}: PitchedRoofCalculatorStepsProps) => {
  const { getMicroCopy } = useSiteContext();
  const pushEvent = useContext(AnalyticsContext);

  const [roof, setRoof] = useState<Roof | undefined>(undefined);
  const [dimensions, setDimensions] = useState<DimensionsValues>({});
  const [mainTileCode, setMainTileCode] = useState<string | undefined>(
    undefined
  );
  const [variant, setVariant] = useState<Tile | undefined>(undefined);
  const [tileOptions, setTileOptions] = useState<
    TileOptionSelections | undefined
  >(undefined);
  const [underlay, setUnderlay] = useState<Underlay | undefined>(undefined);
  const [guttering, setGuttering] = useState<GutteringSelections | undefined>(
    undefined
  );

  const [data, setData] = useState<Data>({
    tiles: {},
    underlays: [],
    gutterHooks: [],
    gutters: {}
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false);
  const {
    config: { esIndexNameProduct }
  } = useConfig();

  const fetchCalculatorData = async (dimensions: DimensionsValues) => {
    setLoading(true);
    try {
      const pitchValues = getPitchValues(dimensions);
      const res = await queryElasticSearch(
        getProductsQuery(pitchValues),
        esIndexNameProduct
      );
      const hits = res.hits.hits.map((hit) => hit._source);
      setData(prepareProducts(hits));
    } catch (err) {
      devLog("Failed to fetch data", err);
    }
    setLoading(false);
  };

  const resetSelectedData = () => {
    setRoof(undefined);
    setDimensions(undefined);
    setMainTileCode(undefined);
    setVariant(undefined);
    setTileOptions(undefined);
    setUnderlay(undefined);
    setGuttering(undefined);
  };

  const selectRoof = (
    e: React.FormEvent,
    { roof: newRoofId }: { roof: string }
  ) => {
    e.preventDefault();
    const newRoof = roofs.find((roof) => roof.id === newRoofId);
    setSelected(CalculatorSteps.EnterDimensions);
    if (newRoof === roof) return;
    setRoof(newRoof);
    setDimensions({});
  };

  const saveDimensions = (
    e: React.FormEvent<Element>,
    values: DimensionsValues
  ) => {
    e.preventDefault();

    pushEvent({
      event: "dxb.button_click",
      id: "rc-dimensions",
      label: getMicroCopy(microCopy.ROOF_DIMENSIONS_NEXT_LABEL),
      action: "selected"
    });

    if (!shallowEqual(values, dimensions)) {
      setDimensions(values);
      fetchCalculatorData(values);
    }

    setMainTileCode(undefined);
    setSelected(CalculatorSteps.SelectTile);
  };

  const selectTile = (_, { tile: newTileCode }: { tile: string }) => {
    setSelected(CalculatorSteps.SelectVariant);
    if (newTileCode === mainTileCode) return;
    setMainTileCode(newTileCode);
    setVariant(undefined);
  };

  const selectVariant = async (
    _,
    { variant: newVariantCode }: { variant: string }
  ) => {
    if (newVariantCode === variant?.externalProductCode) {
      setSelected(CalculatorSteps.TileOptions);
      return;
    }
    // eslint-disable-next-line security/detect-object-injection
    const newVariant = data.tiles[mainTileCode].find(
      (variant) => variant.externalProductCode === newVariantCode
    );

    setVariant(newVariant);
    setTileOptions(undefined);
    try {
      setLoading(true);
      const query = constructQueryForProductReferences(
        newVariant.productReferences
      );
      const res = await queryElasticSearch(query, esIndexNameProduct);
      const hits = res.hits.hits.map((hit) => hit._source);
      const productReferences =
        transformProductReferences<ReferencedTileProducts>(
          newVariant.productReferences,
          hits,
          mainTileReferencesMapper
        );

      const {
        left,
        right,
        leftStart,
        rightStart,
        halfLeft,
        halfRight,
        ...rest
      } = productReferences;

      setVariant({
        ...newVariant,
        ...rest,
        vergeOption: getVergeOption({
          left,
          right,
          leftStart,
          rightStart,
          halfLeft,
          halfRight
        })
      });
      setSelected(CalculatorSteps.TileOptions);
    } catch (err) {
      devLog("Failed to fetch references", err);
    }
    setLoading(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
  const saveAndMove = <T extends any>(
    e: React.FormEvent<Element>,
    values: T,
    set: React.Dispatch<React.SetStateAction<T | undefined>>,
    next: CalculatorSteps
  ) => {
    e.preventDefault();
    set(values);
    setSelected(next);
  };

  const measurements: Measurements | null = useMemo(() => {
    if (!roof || !dimensions) return null;
    const { faces, lines } = roof.getMeasurements(dimensions);

    if (Array.isArray(dimensions.protrusions)) {
      for (const { type, ...protrusionDimensions } of dimensions.protrusions) {
        // eslint-disable-next-line security/detect-object-injection
        const protrusionType: Protrusion | undefined = protrusionTypes[type];
        if (protrusionType?.getMeasurements) {
          // eslint-disable-next-line security/detect-object-injection
          const { faces: pFaces, lines: pLines } =
            protrusionType.getMeasurements({
              ...protrusionDimensions,
              roofPitch: dimensions[roof.roofPitchField] // Says on what face of the roof the protrusion is
            });
          faces.push(...pFaces);
          Object.keys(lines).forEach((line) =>
            // eslint-disable-next-line security/detect-object-injection
            lines[line as keyof LinesMap].push(
              ...pLines[line as keyof LinesMap]
            )
          );
        }
      }
    }

    return {
      faces,
      lines,
      area: calculateArea(faces)
    };
  }, [roof, dimensions]);

  const formattedArea = ((measurements?.area || 0) / 10000).toFixed(2);

  const getUnderlayByProductCode = (externalProductCode: string): Underlay =>
    data.underlays.find(
      (underlay) => underlay.externalProductCode === externalProductCode
    );

  const selectTileOptions = (
    e: React.FormEvent,
    selection: { ridge?: string; verge?: string; ventilation?: string[] }
  ) => {
    e.preventDefault();
    setSelected(CalculatorSteps.SelectUnderlay);
    const ridge = variant.ridgeOptions.find(
      (ridge) => ridge.externalProductCode === selection.ridge
    );

    const verge = selection.verge !== "none" ? variant.vergeOption : undefined;
    const ventilationHoods = variant.ventilationHoodOptions.filter(
      (ventilationHood) =>
        selection.ventilation?.includes(ventilationHood.externalProductCode)
    );
    setTileOptions({ ridge, verge, ventilationHoods });
  };

  useEffect(() => {
    if (selected === "your-solution-contains") {
      pushEvent({
        event: "dxb.button_click",
        id: "rc-solution-m2",
        label: "m²",
        action: formattedArea
      });
    }
  }, [selected, formattedArea]);

  const onGutterSelect = async (
    e: React.FormEvent,
    selection: GutteringFormSelection
  ) => {
    e.preventDefault();
    const currentGuttering: GutteringFormSelection = {
      downPipeConnectors: guttering?.downPipeConnectors,
      downPipes: guttering?.downPipes,
      guttering: guttering?.guttering,
      gutteringHook: guttering?.gutteringHook?.externalProductCode,
      gutteringVariant: guttering?.gutteringVariant?.externalProductCode
    };

    if (shallowEqual(currentGuttering, selection)) {
      setSelected(CalculatorSteps.YourSolutionContains);
      return;
    }

    const ridgeReferencesToFetch = tileOptions?.ridge?.productReferences || [];
    const gutteringVariant = data.gutters[selection?.guttering]?.find(
      ({ externalProductCode }) =>
        externalProductCode === selection.gutteringVariant
    );
    const gutteringHook = data.gutterHooks.find(
      ({ externalProductCode }) =>
        selection?.gutteringHook === externalProductCode
    );

    const referencesToFetch = [
      ...ridgeReferencesToFetch,
      ...(gutteringVariant?.productReferences || [])
    ];

    try {
      const res = await queryElasticSearch(
        constructQueryForProductReferences(referencesToFetch),
        esIndexNameProduct
      );
      const hits = res.hits.hits.map((hit) => hit._source);
      const preparedData = transformProductReferences<NestedProductReferences>(
        referencesToFetch,
        hits,
        nestedProductReferencesMapper
      );
      const { downPipe, downPipeConnector, ridgeEnd, yRidge, tRidge } =
        preparedData;

      setTileOptions((tileOptions) => {
        let ridge = tileOptions.ridge;

        if (ridge) {
          ridge = { ...ridge, yRidge, tRidge, ridgeEnd };
        }

        return { ...tileOptions, ridge };
      });

      if (gutteringVariant) {
        setGuttering({
          downPipes: selection.downPipes,
          downPipeConnectors: selection.downPipeConnectors,
          gutteringHook,
          guttering: selection.guttering,
          gutteringVariant: { ...gutteringVariant, downPipe, downPipeConnector }
        });
      }
    } catch (err) {
      devLog("Failed to fetch inner products", err);
    }
    setSelected(CalculatorSteps.YourSolutionContains);
  };

  return (
    <div className={styles["PitchedRoofCalculatorSteps"]}>
      <CalculatorStepper selected={selected} loading={loading}>
        <CalculatorStepper.Step
          key={CalculatorSteps.SelectRoof}
          title={getMicroCopy(microCopy.ROOF_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.ROOF_SELECTION_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.ROOF_SELECTION_NEXT_LABEL)}
          nextButtonOnClick={selectRoof}
        >
          <RoofSelection
            requiredRoofShapes={calculatorConfig?.roofShapes}
            selected={roof}
          />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key={CalculatorSteps.EnterDimensions}
          title={getMicroCopy(microCopy.ROOF_DIMENSIONS_TITLE)}
          subtitle={getMicroCopy(microCopy.ROOF_DIMENSIONS_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.ROOF_DIMENSIONS_NEXT_LABEL)}
          nextButtonOnClick={saveDimensions}
          backLabel={getMicroCopy(microCopy.ROOF_DIMENSIONS_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-dimensions",
              label: getMicroCopy(microCopy.ROOF_DIMENSIONS_BACK_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.SelectRoof);
          }}
        >
          {roof ? <RoofDimensions roof={roof} dimensions={dimensions} /> : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key={CalculatorSteps.SelectTile}
          title={getMicroCopy(microCopy.TILE_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.TILE_SELECTION_SUBTITLE)}
          backLabel={getMicroCopy(microCopy.TILE_SELECTION_BACK_LABEL)}
          nextLabel={getMicroCopy(microCopy.TILE_SELECTION_NEXT_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-tile",
              label: getMicroCopy(microCopy.TILE_SELECTION_BACK_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.EnterDimensions);
          }}
          nextButtonOnClick={selectTile}
        >
          <TileSelection tiles={data.tiles} selected={mainTileCode} />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key={CalculatorSteps.SelectVariant}
          title={getMicroCopy(microCopy.VARIANT_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.VARIANT_SELECTION_SUBTITLE)}
          backLabel={getMicroCopy(microCopy.VARIANT_SELECTION_BACK_LABEL)}
          nextLabel={getMicroCopy(microCopy.VARIANT_SELECTION_NEXT_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-tile-colour",
              label: getMicroCopy(microCopy.VARIANT_SELECTION_BACK_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.SelectTile);
          }}
          nextButtonOnClick={selectVariant}
        >
          {mainTileCode ? (
            <VariantSelection
              selected={variant}
              // eslint-disable-next-line security/detect-object-injection
              options={data.tiles[mainTileCode]}
            />
          ) : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key={CalculatorSteps.TileOptions}
          title={getMicroCopy(microCopy.TILE_OPTIONS_TITLE)}
          subtitle={getMicroCopy(microCopy.TILE_OPTIONS_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.TILE_OPTIONS_NEXT_LABEL)}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: getMicroCopy(microCopy.TILE_OPTIONS_NEXT_LABEL),
              action: "selected"
            });
            selectTileOptions(e, values);
          }}
          backLabel={getMicroCopy(microCopy.TILE_OPTIONS_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-options-accessories",
              label: getMicroCopy(microCopy.TILE_OPTIONS_BACK_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.SelectVariant);
          }}
        >
          {variant ? (
            <TileOptions variant={variant} selections={tileOptions} />
          ) : null}
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key={CalculatorSteps.SelectUnderlay}
          title={getMicroCopy(microCopy.UNDERLAY_SELECTION_TITLE)}
          subtitle={getMicroCopy(microCopy.UNDERLAY_SELECTION_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.UNDERLAY_SELECTION_NEXT_LABEL)}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-underlay",
              label: getMicroCopy(microCopy.UNDERLAY_SELECTION_NEXT_LABEL),
              action: "selected"
            });
            saveAndMove(
              e,
              getUnderlayByProductCode(String(values.underlay)),
              setUnderlay,
              CalculatorSteps.Guttering
            );
          }}
          backLabel={getMicroCopy(microCopy.UNDERLAY_SELECTION_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-underlay",
              label: getMicroCopy(microCopy.UNDERLAY_SELECTION_BACK_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.TileOptions);
          }}
        >
          <UnderlaySelection options={data.underlays} selected={underlay} />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          key={CalculatorSteps.Guttering}
          title={getMicroCopy(microCopy.GUTTERING_TITLE)}
          subtitle={getMicroCopy(microCopy.GUTTERING_SUBTITLE)}
          nextLabel={getMicroCopy(microCopy.GUTTERING_NEXT_LABEL)}
          nextButtonOnClick={(e, values) => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(microCopy.GUTTERING_NEXT_LABEL),
              action: "selected"
            });
            onGutterSelect(e, values);
          }}
          backLabel={getMicroCopy(microCopy.GUTTERING_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(microCopy.GUTTERING_BACK_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.SelectUnderlay);
          }}
          linkLabel={getMicroCopy(microCopy.GUTTERING_SKIP_LABEL)}
          linkOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-select-guttering",
              label: getMicroCopy(microCopy.GUTTERING_SKIP_LABEL),
              action: "selected"
            });
            setGuttering(undefined);
            setSelected(CalculatorSteps.YourSolutionContains);
          }}
        >
          <Guttering
            selections={guttering}
            gutters={data.gutters}
            gutterHooks={data.gutterHooks}
          />
        </CalculatorStepper.Step>
        <CalculatorStepper.Step
          isForm={false}
          key={CalculatorSteps.YourSolutionContains}
          title={getMicroCopy(microCopy.RESULTS_TITLE)}
          subtitle={getMicroCopy(microCopy.RESULTS_SUBTITLE, {
            contingency: CONTINGENCY_PERCENTAGE_TEXT
          })}
          paragraph={
            <span>
              {`${getMicroCopy(
                microCopy.RESULTS_AREA_LABEL
              )}: ${formattedArea}m`}
              <sup>2</sup>
            </span>
          }
          backLabel={getMicroCopy(microCopy.RESULTS_BACK_LABEL)}
          backButtonOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-solution",
              label: getMicroCopy(microCopy.RESULTS_BACK_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.Guttering);
          }}
          linkLabel={getMicroCopy(microCopy.RESULTS_START_OVER_LABEL)}
          linkOnClick={() => {
            pushEvent({
              event: "dxb.button_click",
              id: "rc-solution",
              label: getMicroCopy(microCopy.RESULTS_START_OVER_LABEL),
              action: "selected"
            });
            setSelected(CalculatorSteps.SelectRoof);
            resetSelectedData();
          }}
        >
          {measurements && variant && tileOptions && underlay && (
            <Results
              isDebugging={isDebugging}
              measurements={measurements}
              variant={variant}
              tileOptions={tileOptions}
              underlay={underlay}
              guttering={guttering}
              hubSpotFormId={calculatorConfig?.hubSpotFormId}
            />
          )}
        </CalculatorStepper.Step>
      </CalculatorStepper>
    </div>
  );
};

export default PitchedRoofCalculatorSteps;
