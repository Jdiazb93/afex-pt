import React, { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  isAfter,
} from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "motion/react";
import type { DatePickerProps } from "@interfaces/datePicker";

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  label,
  id,
  name,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value || undefined
  );
  const [showYearSelector, setShowYearSelector] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleDocumentClick = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const renderHeader = () => (
    <div className="flex items-center justify-between px-4 py-2">
      <motion.button
        whileHover={{ cursor: "pointer" }}
        type="button"
        onClick={handlePrevMonth}
      >
        &lt;
      </motion.button>

      <div
        className="font-semibold hover:underline hover:cursor-pointer"
        onClick={() => setShowYearSelector(true)}
      >
        {format(currentMonth, "MMMM yyyy", { locale: es })}
      </div>

      <motion.button
        whileHover={{ cursor: "pointer" }}
        type="button"
        onClick={handleNextMonth}
      >
        &gt;
      </motion.button>
    </div>
  );

  const renderDays = () => {
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <motion.div layout className="grid grid-cols-7 gap-1 px-2">
        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
          <div key={d} className="text-center text-xs text-gray-500">
            {d}
          </div>
        ))}
        {days.map((date) => {
          const disabled =
            (minDate && isBefore(date, minDate)) ||
            (maxDate && isAfter(date, maxDate));

          const isSelected = value && isSameDay(date, value);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <button
              type="button"
              key={date.toString()}
              onClick={() => {
                if (!disabled) {
                  onChange && onChange(date);
                  setSelectedDate(date);
                  setIsOpen(false);
                }
              }}
              className={`hover:cursor-pointer rounded-full w-8 h-8 text-sm flex items-center justify-center
                ${!isCurrentMonth ? "text-gray-300" : ""}
                ${
                  disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-100"
                }
                ${isSelected ? "bg-blue-500 text-white" : ""}`}
              disabled={disabled}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </motion.div>
    );
  };

  const renderYearSelector = () => {
    const currentYear = currentMonth.getFullYear();
    const thisYear = new Date().getFullYear();
    const years = Array.from(
      { length: thisYear - 2000 + 1 },
      (_, i) => thisYear - i
    );

    return (
      <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => {
              setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
              setShowYearSelector(false);
            }}
            className={`rounded-md py-1 text-sm ${
              year === currentYear ? "font-bold text-blue-600" : ""
            } hover:bg-blue-100 hover:cursor-pointer`}
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative" ref={wrapperRef}>
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
            pointerEvents: "none",
          }}
          animate={{
            top: selectedDate ? "0%" : "50%",
            translateY: selectedDate ? "-100%" : "-50%",
            fontSize: selectedDate ? "12px" : "16px",
            color: selectedDate ? "#333333" : "#6f6f6f",
          }}
          htmlFor={id}
          transition={{ duration: 0.2 }}
        >
          {label ?? "Selecciona una fecha"}
        </motion.label>
      )}

      <input
        className="hidden"
        id={id}
        name={name}
        value={selectedDate && format(selectedDate, "dd/MM/yyyy")}
        readOnly
      />
      <motion.button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setShowYearSelector(false);
        }}
        initial={{
          border: "1px solid #99a1af",
          borderRadius: "6px",
          width: "100%",
          padding: "8px 8px",
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
        className="text-start outline-none pr-6"
      >
        {selectedDate && format(selectedDate, "dd/MM/yyyy")}
      </motion.button>

      {selectedDate && (
        <button
          type="button"
          onClick={() => {
            setSelectedDate(undefined);
            onChange && onChange(undefined);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm hover:cursor-pointer"
          aria-label="Borrar fecha"
        >
          ✕
        </button>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="datepicker"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow p-2 space-y-2"
          >
            {renderHeader()}
            {showYearSelector ? renderYearSelector() : renderDays()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
