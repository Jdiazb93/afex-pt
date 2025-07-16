import { useCallback } from "react";

export const parseMoney = () => {
  const format = useCallback((value: number): string => {
    return value.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }, []);

  return format;
};
