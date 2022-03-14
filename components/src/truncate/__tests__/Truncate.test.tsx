import React from "react";
import Truncate from "../Truncate";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Truncate component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Truncate lines={2}>
        Nulla quis adipisicing fugiat amet occaecat qui quis exercitation elit
        enim. Culpa nostrud dolore ea ipsum sit non id ullamco aliquip
        adipisicing Lorem non. Velit nulla adipisicing pariatur adipisicing esse
        veniam laborum eiusmod reprehenderit ut ipsum incididunt. Reprehenderit
        ipsum sint mollit officia nostrud anim anim. Veniam aliqua dolor cillum
        sit in commodo nulla exercitation est veniam veniam qui anim enim.
        Officia officia eu consectetur dolor ipsum.
      </Truncate>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with custom component", () => {
    const { container } = renderWithThemeProvider(
      <Truncate lines={2} component="p">
        Nulla quis adipisicing fugiat amet occaecat qui quis exercitation elit
        enim. Culpa nostrud dolore ea ipsum sit non id ullamco aliquip
        adipisicing Lorem non. Velit nulla adipisicing pariatur adipisicing esse
        veniam laborum eiusmod reprehenderit ut ipsum incididunt. Reprehenderit
        ipsum sint mollit officia nostrud anim anim. Veniam aliqua dolor cillum
        sit in commodo nulla exercitation est veniam veniam qui anim enim.
        Officia officia eu consectetur dolor ipsum.
      </Truncate>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with custom class name", () => {
    const { container } = renderWithThemeProvider(
      <Truncate lines={2} className="custom-class-name">
        Nulla quis adipisicing fugiat amet occaecat qui quis exercitation elit
        enim. Culpa nostrud dolore ea ipsum sit non id ullamco aliquip
        adipisicing Lorem non. Velit nulla adipisicing pariatur adipisicing esse
        veniam laborum eiusmod reprehenderit ut ipsum incididunt. Reprehenderit
        ipsum sint mollit officia nostrud anim anim. Veniam aliqua dolor cillum
        sit in commodo nulla exercitation est veniam veniam qui anim enim.
        Officia officia eu consectetur dolor ipsum.
      </Truncate>
    );
    expect(container).toMatchSnapshot();
  });
});
