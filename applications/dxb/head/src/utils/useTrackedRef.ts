import { useState, useCallback } from "react";

type UseTrackedRefHook<T extends HTMLElement> = {
  node: T | null;
  ref: (newNode: T) => void;
};

export const useTrackedRef = <
  T extends HTMLElement
>(): UseTrackedRefHook<T> => {
  const [node, setNode] = useState<T | null>(null);

  const ref = useCallback((newNode: T) => {
    if (newNode) {
      setNode(newNode);
    }
  }, []);

  return {
    node,
    ref
  };
};
