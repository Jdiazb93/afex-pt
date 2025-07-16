import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = (props) => {
  const { label, id, name, onChange, value, defaultValue, autoComplete } =
    props;
  const [labelUpward, setLabelUpward] = useState<boolean>(false);

  const submitOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setLabelUpward(true);
    } else if (!value) {
      setLabelUpward(false);
    }
    onChange && onChange(e);
  };

  useEffect(() => {
    if (value || defaultValue) {
      setLabelUpward(true);
    } else {
      setLabelUpward(false);
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
        initial={{
          border: "1px solid #99a1af",
          borderRadius: "6px",
          width: "100%",
          padding: "8px 8px",
          backgroundColor: "#fff",
        }}
        whileFocus={{
          borderColor: "#2b7fff",
          boxShadow: "1px 1px 8px 1px #b8e6fe",
        }}
        transition={{ transitionDuration: { duration: 0.2 } }}
        className="outline-none"
        id={id}
        name={name}
        onChange={submitOnChange}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
      />
    </div>
  );
};
