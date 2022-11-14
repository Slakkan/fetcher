"use client";
import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

const useWidth = () => {
  const isFirstRedender = useRef(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowWidthDebounced] = useDebounce(windowWidth, 200);

  useEffect(() => {
    if (isFirstRedender.current && window !== null) {
      isFirstRedender.current = false;
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    }
  }, []);

  return windowWidthDebounced;
};

export default useWidth;
