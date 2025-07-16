import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number, hasError: boolean) => void;
  minAmount?: number | undefined;
  maxAmount?: number | undefined;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  onValueChange,
  defaultValue,
  autoComplete,
  minAmount,
  maxAmount,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [labelUpward, setLabelUpward] = useState(false);
  const [hasError, setHasError] = useState(false);

  const formatToCLP = (val: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const validate = (val: number) => {
    if (minAmount !== undefined && val < minAmount) return true;
    if (maxAmount !== undefined && val > maxAmount) return true;
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = Number(rawValue);

    if (!isNaN(numericValue)) {
      setDisplayValue(formatToCLP(numericValue));
      setLabelUpward(true);
      const error = validate(numericValue);
      setHasError(error);
      onChange?.(numericValue);
      onValueChange?.(numericValue, error);
    } else {
      setDisplayValue("");
      setLabelUpward(false);
      setHasError(false);
      onChange?.(0);
      onValueChange?.(0, false);
    }
  };

  useEffect(() => {
    if (value || defaultValue) {
      const numeric = value ?? Number(defaultValue);
      const error = validate(numeric);
      setHasError(error);
      setDisplayValue(formatToCLP(numeric));
      setLabelUpward(true);
      onValueChange?.(numeric, error);
    }
  }, [value, defaultValue]);

  return (
    <div className="relative">
      {label && (
        <motion.label
          initial={{
            position: "absolute",
            top: "50%",
            translateY: "-50%",
            left: "8px",
            fontSize: "16px",
            backgroundColor: "#ffffff00",
            color: "#6f6f6f",
          }}
          animate={{
            position: "absolute",
            top: labelUpward ? "0%" : "50%",
            translateY: labelUpward ? "-100%" : "-50%",
            fontSize: labelUpward ? "12px" : "16px",
            color: labelUpward ? "#333333" : "#6f6f6f",
          }}
          htmlFor={id}
        >
          {label}
        </motion.label>
      )}

      <motion.input
        id={id}
        name={name}
        inputMode="numeric"
        autoComplete={autoComplete}
        className={`outline-none ${hasError ? "border-red-500" : ""}`}
        value={displayValue}
        onChange={handleInputChange}
        initial={{
          border: `1px solid ${hasError ? "#dc2626" : "#99a1af"}`,
          borderRadius: "6px",
          width: "100%",
          padding: "8px 8px",
          backgroundColor: "#fff",
        }}
        whileFocus={{
          borderColor: hasError ? "#dc2626" : "#2b7fff",
          boxShadow: hasError
            ? "1px 1px 8px 1px #fecaca"
            : "1px 1px 8px 1px #b8e6fe",
        }}
        transition={{ transitionDuration: { duration: 0.2 } }}
      />
    </div>
  );
};
