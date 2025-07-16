import React from "react";
import { motion } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: "primary" | "danger" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  value,
  buttonType = "primary",
  className = "",
  disabled = false,
}) => {
  const baseColor =
    buttonType === "primary"
      ? "#2b7fff"
      : buttonType === "secondary"
      ? "#6f6f6f"
      : "#fb2c36";
  const shadowColor =
    buttonType === "primary"
      ? "#0065ff"
      : buttonType === "secondary"
      ? "#6f6f6f"
      : "#fe8086";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`outline-none ${className}`}
      initial={{
        border: `1px solid ${baseColor}`,
        borderRadius: "6px",
        padding: "4px 8px",
        opacity: 0,
        color: baseColor,
        backgroundColor: "#ffffff",
        cursor: "pointer",
      }}
      animate={{
        opacity: 1,
        border: `1px solid ${disabled ? "#d1d5db" : baseColor}`,
        color: disabled ? "#9ca3af" : baseColor,
        backgroundColor: disabled ? "#f2f2f2" : "#ffffff",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      whileHover={
        disabled
          ? {}
          : {
              backgroundColor: baseColor,
              color: "#fff",
              cursor: "pointer",
            }
      }
      whileFocus={
        disabled
          ? {}
          : {
              borderColor: baseColor,
              boxShadow: `1px 1px 8px 1px ${shadowColor}`,
            }
      }
    >
      {value ?? "Botón"}
    </motion.button>
  );
};
