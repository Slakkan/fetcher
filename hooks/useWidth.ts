"use client";
import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";

const useWindowSize = () => {
  const isFirstRedender = useRef(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidthDebounced] = useDebounce(windowWidth, 200);
  const [windowHeightDebounced] = useDebounce(windowHeight, 200);

  useEffect(() => {
    if (isFirstRedender.current && window !== null) {
      isFirstRedender.current = false;
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      window.addEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      });
    }
  }, []);

  return [windowWidthDebounced, windowHeightDebounced];
};

export default useWindowSize;
