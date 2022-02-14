// NOTE: source code copied from https://github.com/Swizec/useDimensions with unmerged SSR support. Removed scroll event listening and x, y values in the return object.

import { useState, useCallback, useLayoutEffect, useEffect } from "react";

export type DimensionObject = Partial<{
  width: number;
  height: number;
  right: number;
  bottom: number;
}>;

export type UseDimensionsHook = [
  (node: HTMLElement | null) => void,
  DimensionObject,
  HTMLElement | null
];

export interface UseDimensionsArgs {
  liveMeasure?: boolean;
}

function getDimensionObject(node: HTMLElement): DimensionObject {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    right: rect.right,
    bottom: rect.bottom
  };
}

function useDimensions({
  liveMeasure = true
}: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState<DimensionObject>({});
  const [node, setNode] = useState<HTMLElement | null>(null);
  const useLayoutHookBasedOnEnvironment =
    typeof window === "undefined" ? useEffect : useLayoutEffect;

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutHookBasedOnEnvironment(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setDimensions(getDimensionObject(node))
        );
      measure();

      if (liveMeasure) {
        window.addEventListener("resize", measure);

        return () => {
          window.removeEventListener("resize", measure);
        };
      }
    }
  }, [node]);

  return [ref, dimensions, node];
}

export default useDimensions;
