import {
  useState,
  useEffect,
  useLayoutEffect,
  Dispatch,
  SetStateAction
} from "react";

const useStickyState = <V,>(
  defaultValue: V,
  key: string
): [V, Dispatch<SetStateAction<V>>, boolean] => {
  const [value, setValue] = useState(defaultValue);
  // If true then the component is mounted and it has access to local storage
  const [isMounted, setIsMounted] = useState(false);

  // Local storage in ssr value appears after first rendering
  useLayoutEffect(() => {
    setIsMounted(true);
    const stickyValue = window.localStorage.getItem(key);
    setValue(stickyValue !== null ? JSON.parse(stickyValue) : defaultValue);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue, isMounted];
};

export default useStickyState;
