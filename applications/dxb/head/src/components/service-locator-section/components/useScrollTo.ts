import { MutableRefObject, useEffect, useState } from "react";

export const useScrollTo = (
  isOpen: boolean,
  htmlElement: MutableRefObject<HTMLElement>
): React.Dispatch<React.SetStateAction<boolean>>[] => {
  const [hasElementExpansionCompleted, setElementExpansionCompleted] =
    useState(false);
  useEffect(() => {
    if (isOpen && htmlElement.current && hasElementExpansionCompleted) {
      htmlElement.current.parentElement &&
        htmlElement.current.parentElement.scrollTo({
          top: htmlElement.current.offsetTop + 1,
          behavior: "smooth"
        });
    }
  }, [isOpen, hasElementExpansionCompleted, htmlElement.current]);
  return [setElementExpansionCompleted];
};
