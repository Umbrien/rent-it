import type React from "react";
import { useDebugValue, useEffect, useState } from "react";

export const useLocalStorage = <S>(
  key: string,
  initialState?: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] => {
  const [state, setState] = useState<S>(initialState as S);
  useDebugValue(state);

  useEffect(() => {
    const item = localStorage.getItem(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (item) setState(parse(item));
  }, []);

  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [state]);

  return [state, setState];
};

const parse = (value: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(value);
  } catch {
    return value;
  }
};
