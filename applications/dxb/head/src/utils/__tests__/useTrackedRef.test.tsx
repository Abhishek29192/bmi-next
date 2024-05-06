import React from "react";
import { renderHook, render } from "@testing-library/react";
import { useTrackedRef } from "../useTrackedRef";

describe("useTrackedRef hook", () => {
  it("assigns html node to ref", async () => {
    const { result } = renderHook(useTrackedRef<HTMLDivElement>);
    expect(result.current.node).toBeNull();
    render(<div ref={result.current.ref} />);

    expect(result.current.node).toBeInTheDocument();
  });
});
