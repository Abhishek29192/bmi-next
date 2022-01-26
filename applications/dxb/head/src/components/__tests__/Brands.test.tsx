import React from "react";
import { render } from "@testing-library/react";
import Brands from "../Brands";

describe("Brands component", () => {
  it("renders correctly", () => {
    const brandData = [
      {
        title: "Smilex",
        path: "/smilex",
        subtitle: "Uh-oh.  He don't look happy. He's been using brand X",
        brandLogo: "BMI"
      }
    ];

    const { container } = render(<Brands data={brandData} />);
    expect(container).toMatchSnapshot();
  });
});
