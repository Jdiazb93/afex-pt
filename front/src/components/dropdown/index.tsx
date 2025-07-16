import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { DropdownProps } from "@interfaces/dropdown";

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onChange,
  label,
  id,
  name,
  multiple = true,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    selected ?? []
  );
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelUpward = isOpen || selectedOptions.length > 0;

  const toggleOption = (value: string) => {
    let newSelected: string[];

    if (multiple) {
      if (selectedOptions.includes(value)) {
        newSelected = selectedOptions.filter((v) => v !== value);
      } else {
        newSelected = [...selectedOptions, value];
      }
    } else {
      newSelected = [value];
      setIsOpen(false); // cerrar al seleccionar si es único
    }

    setSelectedOptions(newSelected);
    onChange && onChange(newSelected);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getSelectedLabels = () => {
    const selectedLabels = options.filter((opt) =>
      selectedOptions.includes(opt.value)
    );

    return selectedLabels.map((opt, index) => (
      <span key={opt.value} className="inline-flex items-center gap-1">
        {opt.icon && <span className={opt.icon}></span>}
        <span>{opt.label}</span>
        {index < selectedLabels.length - 1 && <span>,&nbsp;</span>}
      </span>
    ));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <motion.label
          htmlFor={id}
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
            top: labelUpward ? "0%" : "50%",
            translateY: labelUpward ? "-100%" : "-50%",
            fontSize: labelUpward ? "12px" : "16px",
            color: labelUpward ? "#333" : "#6f6f6f",
            cursor: labelUpward ? "" : "pointer",
          }}
          transition={{ duration: 0.2 }}
          onClick={() => !labelUpward && setIsOpen((prev) => !prev)}
        >
          {label}
        </motion.label>
      )}

      {selectedOptions.map((option, index) => (
        <input
          key={`${option}-${index}`}
          type="text"
          className="hidden"
          value={option}
          id={id}
          name={name}
        />
      ))}

      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        initial={{
          border: "1px solid #99a1af",
          borderRadius: "6px",
          width: "100%",
          padding: "8px",
          backgroundColor: "#fff",
          height: "42px",
        }}
        whileFocus={{
          borderColor: "#2b7fff",
          boxShadow: "1px 1px 8px 1px #b8e6fe",
        }}
        whileHover={{
          cursor: "pointer",
        }}
        className="text-left outline-none"
      >
        {getSelectedLabels()}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-1 z-10 w-full bg-white rounded-xl shadow p-2 space-y-1 max-h-60 overflow-auto"
          >
            {options.map(({ value, label, icon }) => {
              const isChecked = selectedOptions.includes(value);
              return (
                <label
                  key={value}
                  className="flex items-center space-x-2 text-sm cursor-pointer px-2 py-1 rounded hover:bg-blue-50"
                >
                  <input
                    type={multiple ? "checkbox" : "radio"}
                    checked={isChecked}
                    onChange={() => toggleOption(value)}
                    name={name}
                    className="accent-blue-600"
                  />
                  {icon && <span className={icon}></span>}
                  <span>{label}</span>
                </label>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
