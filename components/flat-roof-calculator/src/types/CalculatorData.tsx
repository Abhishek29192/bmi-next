export type Path = {
  option: string;
  target: Tree | string;
};

export type CalculatorDataProduct = {
  code: string;
  description: string;
  size: string;
  coverage: number;
};

export type ProductReference = {
  buildUp: "A" | "B" | "C" | "D";
  category: string;
  selector:
    | string
    | {
        if: "color";
        is: string;
        use: string;
      };
};

export type CalculatorOptions = {
  COVERAGE: ProductReference[];
  UPSTAND: ProductReference[];
  KERB: ProductReference[];
  MISCELLANEOUS: ProductReference[];
};

export type Calculators = {
  [calculator: string]: CalculatorOptions;
};

export type Tree = {
  paths: Path[];
  field: string;
};

export type CalculatorData = {
  tree: Tree;
  products: CalculatorDataProduct[];
  calculators: Calculators;
};
