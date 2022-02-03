import React from "react";
import { render } from "@testing-library/react";
import Truncate from "../";

describe("Truncate component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Truncate lines="2">
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
    const { container } = render(
      <Truncate lines="2" component="p">
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
