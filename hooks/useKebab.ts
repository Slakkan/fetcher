import { useState, useRef, useCallback, useEffect, MouseEvent } from "react";

const useKebab = () => {
  const [openKebabIndex, setOpenKebabIndex] = useState(-1);
  const openKebabRef = useRef<any>(null);

  const onKebabClick = useCallback(
    (e: MouseEvent, index: number) => {
      if (openKebabIndex !== index) {
        setOpenKebabIndex(index);
        openKebabRef.current = e.target;
      } else {
        setOpenKebabIndex(-1);
      }
    },
    [openKebabIndex]
  );

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (e.target instanceof HTMLElement && openKebabRef.current && !openKebabRef.current.contains(e.target)) {
        setOpenKebabIndex(-1);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return [openKebabIndex, onKebabClick] as [number, (e: MouseEvent, index: number) => void];
};

export default useKebab;
