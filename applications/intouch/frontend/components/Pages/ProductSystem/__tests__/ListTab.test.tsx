import React from "react";
import ListTab, {
  ProductsTabProps,
  productDetailToShow,
  systemDetailToShow,
  getValue,
  getSelectedItemValue
} from "../ListTab";
import {
  renderWithAllProviders,
  renderAsReal,
  screen,
  fireEvent
} from "../../../../lib/tests/utils";
import { generateProduct } from "../../../../lib/tests/factories/product";

const useUpdateProductMutationSpy = jest.fn();
const useUpdateSystemMutationSpy = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useUpdateProductMutation: ({ onCompleted, onError }) => [
    () => useUpdateProductMutationSpy({ onCompleted, onError })
  ],
  useUpdateSystemMutation: ({ onCompleted, onError }) => [
    () => useUpdateSystemMutationSpy({ onCompleted, onError })
  ]
}));
const productReportSpy = jest.fn().mockReturnValue(<div>ProductReport</div>);
const systemReportSpy = jest.fn().mockReturnValue(<div>SystemReport</div>);
jest.mock("../../../Reports/", () => ({
  ProductReport: (props) => productReportSpy(props),
  SystemReport: (props) => systemReportSpy(props)
}));
const productTableSpy = jest.fn().mockReturnValue(<div>ProductTable</div>);
jest.mock("../ProductTable", () => ({
  ProductTable: (props) => productTableSpy(props)
}));

describe("ListTab", () => {
  const bmiRef = "system_ref_1";
  const generateProps = ({
    type,
    items = [
      generateProduct({
        bmiRef,
        updatedAt: "2022-01-27",
        brand: "product_brand",
        family: "product_family",
        description: "product_description"
      })
    ],
    members = [
      {
        systemBmiRef: bmiRef,
        productByProductBmiRef: {
          ...generateProduct({ bmiRef })
        }
      }
    ]
  }): ProductsTabProps => ({
    type,
    items: { nodes: items },
    members: { nodes: members }
  });
  const t = (value) => value;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Products", () => {
    const props = generateProps({ type: "product" });

    it("render correctly", async () => {
      renderWithAllProviders(<ListTab {...props} />);

      expect(productReportSpy).toHaveBeenCalledWith({ disabled: false });

      fireEvent.click(screen.queryByText(props.items.nodes[0].name));

      expect(
        screen.queryAllByText(props.items.nodes[0].name).length
      ).toBeGreaterThan(1);
      expect(screen.queryByText("edit")).toBeTruthy();
      productDetailToShow.map(({ type, key }) => {
        expect(screen.queryAllByText(key)).toBeTruthy();
        expect(screen.getByTestId("product-tab-details").textContent).toContain(
          getValue(t, type, props.items.nodes[0][`${key}`])
        );
      });

      expect(productTableSpy).toHaveBeenCalledWith({
        products: [props.members.nodes[0].productByProductBmiRef]
      });
    });

    it("render correctly with default value", async () => {
      const items = [
        generateProduct({
          name: null,
          description: null,
          bmiRef,
          brand: null,
          family: null,
          maximumValidityYears: null,
          updatedAt: "2022-01-27"
        })
      ];
      const props = generateProps({ type: "product", items });
      renderWithAllProviders(<ListTab {...props} />);

      fireEvent.click(screen.queryByText(props.items.nodes[0].bmiRef));

      productDetailToShow.map(({ type, key }) => {
        expect(screen.getByTestId("product-tab-details").textContent).toContain(
          getValue(t, type, props.items.nodes[0][`${key}`] || "")
        );
      });
    });

    describe("Edit the record", () => {
      it("edit as super admin", async () => {
        const result = {
          ...props.items.nodes[0],
          name: "name1",
          description: "description1",
          family: "family1",
          brand: "brand1",
          published: false,
          maximumValidityYears: "10"
        };
        useUpdateProductMutationSpy.mockImplementationOnce(({ onCompleted }) =>
          onCompleted({
            updateProduct: {
              query: {
                products: [result]
              }
            }
          })
        );
        const { container } = renderAsReal({
          account: { role: "SUPER_ADMIN" }
        })(<ListTab {...props} />);
        fireEvent.click(screen.queryByText(props.items.nodes[0].name));
        fireEvent.click(screen.queryByText("edit"));

        expect(screen.queryByTestId("product-tab-form")).toBeTruthy();
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "name"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "description"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "family"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "brand"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "published"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "maximumValidityYears"
        );

        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.change(container.querySelector("input[name='name']"), {
          target: { value: result.name }
        });
        fireEvent.change(
          container.querySelector("textarea[name='description']"),
          {
            target: { value: result.description }
          }
        );
        fireEvent.change(container.querySelector("input[name='family']"), {
          target: { value: result.family }
        });
        fireEvent.change(container.querySelector("input[name='brand']"), {
          target: { value: result.brand }
        });
        fireEvent.change(
          container.querySelector("input[name='maximumValidityYears']"),
          {
            target: { value: result.maximumValidityYears }
          }
        );
        fireEvent.click(screen.getByText("Save"));

        expect(useUpdateProductMutationSpy).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("edit")).toBeTruthy();
        productDetailToShow.map(({ type, key }) => {
          expect(
            screen.getByTestId("product-tab-details").textContent
          ).toContain(getValue(t, type, result[`${key}`]));
        });
      });

      it("edit as market admin", async () => {
        const result = { ...props.items.nodes[0], published: false };
        useUpdateProductMutationSpy.mockImplementationOnce(({ onCompleted }) =>
          onCompleted({
            updateProduct: {
              query: {
                products: [result]
              }
            }
          })
        );
        renderAsReal({ account: { role: "MARKET_ADMIN" } })(
          <ListTab {...props} />
        );
        fireEvent.click(screen.queryByText(props.items.nodes[0].name));
        fireEvent.click(screen.queryByText("edit"));

        expect(screen.queryByTestId("product-tab-form")).toBeTruthy();
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "name"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "description"
        );
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("family");
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("brand");
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "published"
        );
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("maximumValidityYears");
      });

      it("edit with default value", async () => {
        const items = [
          generateProduct({
            name: null,
            description: null,
            bmiRef,
            brand: null,
            family: null,
            published: null,
            maximumValidityYears: null,
            updatedAt: "2022-01-27"
          })
        ];
        const props = generateProps({ type: "product", items });
        const { container } = renderAsReal({
          account: { role: "SUPER_ADMIN" }
        })(<ListTab {...props} />);

        fireEvent.click(screen.queryByText(props.items.nodes[0].bmiRef));
        fireEvent.click(screen.queryByText("edit"));

        expect(
          (container.querySelector("input[name='name']") as HTMLInputElement)
            .value
        ).toBe("");
        expect(
          (
            container.querySelector(
              "textarea[name='description']"
            ) as HTMLInputElement
          ).value
        ).toBe("");
        expect(
          (container.querySelector("input[name='family']") as HTMLInputElement)
            .value
        ).toBe("");
        expect(
          (container.querySelector("input[name='brand']") as HTMLInputElement)
            .value
        ).toBe("");
        expect(
          (
            container.querySelector(
              "input[name='published']"
            ) as HTMLInputElement
          ).checked
        ).toBe(false);
        expect(
          (
            container.querySelector(
              "input[name='maximumValidityYears']"
            ) as HTMLInputElement
          ).value
        ).toBe("0");
      });
    });
  });

  describe("Systems", () => {
    const props = generateProps({ type: "system" });

    it("render correctly", async () => {
      renderWithAllProviders(<ListTab {...props} />);

      expect(systemReportSpy).toHaveBeenCalledWith({ disabled: false });

      fireEvent.click(screen.queryByText(props.items.nodes[0].name));

      expect(
        screen.queryAllByText(props.items.nodes[0].name).length
      ).toBeGreaterThan(1);
      expect(screen.queryByText("edit")).toBeTruthy();
      systemDetailToShow.map(({ type, key }) => {
        expect(screen.queryAllByText(key)).toBeTruthy();
        expect(screen.getByTestId("product-tab-details").textContent).toContain(
          getValue(t, type, props.items.nodes[0][`${key}`])
        );
      });
      productDetailToShow
        .filter(
          ({ key }) => !systemDetailToShow.find((system) => system.key === key)
        )
        .map(({ key }) => {
          expect(screen.queryByText(key)).toBeFalsy();
        });
    });

    describe("Edit the record", () => {
      it("edit as super admin", async () => {
        const result = { ...props.items.nodes[0], published: false };
        useUpdateSystemMutationSpy.mockImplementationOnce(({ onCompleted }) =>
          onCompleted({
            updateSystem: {
              query: {
                systems: [result]
              }
            }
          })
        );
        renderAsReal({ account: { role: "SUPER_ADMIN" } })(
          <ListTab {...props} />
        );
        fireEvent.click(screen.queryByText(props.items.nodes[0].name));
        fireEvent.click(screen.queryByText("edit"));

        expect(screen.queryByTestId("product-tab-form")).toBeTruthy();
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "name"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "description"
        );
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("family");
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("brand");
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "published"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "maximumValidityYears"
        );

        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.click(screen.getByText("Save"));

        expect(useUpdateSystemMutationSpy).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("edit")).toBeTruthy();
        systemDetailToShow.map(({ type, key }) => {
          expect(
            screen.getByTestId("product-tab-details").textContent
          ).toContain(getValue(t, type, result[`${key}`]));
        });
      });

      it("edit as market admin", async () => {
        const result = { ...props.items.nodes[0], published: false };
        useUpdateProductMutationSpy.mockImplementationOnce(({ onCompleted }) =>
          onCompleted({
            updateSystem: {
              query: {
                systems: [result]
              }
            }
          })
        );
        renderAsReal({ account: { role: "MARKET_ADMIN" } })(
          <ListTab {...props} />
        );
        fireEvent.click(screen.queryByText(props.items.nodes[0].name));
        fireEvent.click(screen.queryByText("edit"));

        expect(screen.queryByTestId("product-tab-form")).toBeTruthy();
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "name"
        );
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "description"
        );
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("family");
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("brand");
        expect(screen.getByTestId("product-tab-form").textContent).toContain(
          "published"
        );
        expect(
          screen.getByTestId("product-tab-form").textContent
        ).not.toContain("maximumValidityYears");
      });
    });
  });

  it("getValue", () => {
    const values = [
      "technology",
      "bmiRef",
      "description",
      true,
      0,
      "2022-01-27",
      "test"
    ];
    const results = [
      "technology",
      "bmiRef",
      "description",
      "published",
      "0",
      "27 Jan 2022",
      undefined
    ];
    [...systemDetailToShow, { type: "tel", key: "test" }].map(
      ({ type }, index) => {
        expect(getValue(t, type, values[`${index}`])).toBe(results[`${index}`]);
      }
    );
  });

  describe("getSelectedItemValue", () => {
    it("normal case", () => {
      const results = [
        "technology",
        "bmiRef",
        "description",
        true,
        0,
        "2022-01-27"
      ];
      const values = [
        "technology",
        "bmiRef",
        "description",
        true,
        "0",
        "2022-01-27"
      ];
      systemDetailToShow.map(({ key }, index) => {
        expect(getSelectedItemValue(key, values[`${index}`])).toBe(
          results[`${index}`]
        );
      });
    });

    it("no value for type number", () => {
      const results = [
        "technology",
        "bmiRef",
        "description",
        true,
        0,
        "2022-01-27"
      ];
      const values = [
        "technology",
        "bmiRef",
        "description",
        true,
        null,
        "2022-01-27"
      ];
      systemDetailToShow.map(({ key }, index) => {
        expect(getSelectedItemValue(key, values[`${index}`])).toBe(
          results[`${index}`]
        );
      });
    });
  });

  describe("filter", () => {
    it("filter correctly on search", () => {
      const props = generateProps({
        type: "product",
        items: [
          generateProduct({
            bmiRef,
            updatedAt: "2022-01-27",
            brand: "product_brand",
            family: "product_family",
            description: "product_description"
          }),
          generateProduct({
            id: 2,
            name: "name2",
            bmiRef,
            updatedAt: "2022-01-28",
            brand: "product2_brand",
            family: "product2_family",
            description: "product2_description"
          })
        ]
      });

      const { container } = renderWithAllProviders(<ListTab {...props} />);

      fireEvent.change(container.querySelector("#filter"), {
        target: { value: "name2" }
      });

      expect(screen.queryByText("name")).toBeFalsy();
      expect(screen.queryByText("name2")).toBeTruthy();
    });

    it("filter correctly on filter", () => {
      const props = generateProps({
        type: "product",
        items: [
          generateProduct({
            bmiRef,
            updatedAt: "2022-01-27",
            brand: "product_brand",
            family: "product_family",
            description: "product_description"
          }),
          generateProduct({
            id: 2,
            name: "name2",
            technology: "FLAT",
            bmiRef,
            updatedAt: "2022-01-28",
            brand: "product2_brand",
            family: "product2_family",
            description: "product2_description"
          })
        ]
      });

      renderWithAllProviders(<ListTab {...props} />);

      fireEvent.click(screen.getByText("Flat"));

      expect(screen.queryByText("name")).toBeFalsy();
      expect(screen.queryByText("name2")).toBeTruthy();
    });
  });

  it("Able switch edit to show", () => {
    const props = generateProps({ type: "product" });
    renderWithAllProviders(<ListTab {...props} />);

    fireEvent.click(screen.queryByText(props.items.nodes[0].name));
    fireEvent.click(screen.queryByText("edit"));
    fireEvent.click(screen.queryByText("show"));

    expect(screen.queryByText("edit")).toBeTruthy();
  });

  it("Do not have any members", () => {
    const props = generateProps({ type: "product" });
    delete props.members;

    renderWithAllProviders(<ListTab {...props} />);
    // expect(screen.queryByText("fallback.noResults")).toBeTruthy();
    expect(productTableSpy).toHaveBeenCalledTimes(0);
  });
});
