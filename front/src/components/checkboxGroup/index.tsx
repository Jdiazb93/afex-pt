import React, { useState } from "react";
import type { CheckboxGroupProps } from "@interfaces/checkboxGroup";

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selected,
  onChange,
  label,
  id,
  name,
  idPrefix = "checkbox-option",
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    selected ?? []
  );

  const toggleOption = (value: string) => {
    if (selectedOptions.includes(value)) {
      const newSelected = selectedOptions.filter((v) => v !== value);
      setSelectedOptions(newSelected);
      onChange && onChange(newSelected);
    } else {
      setSelectedOptions([...selectedOptions, value]);
      onChange && onChange([...selectedOptions, value]);
    }
  };

  return (
    <div>
      {label && <div className="text-sm text-[#6f6f6f]">{label}</div>}
      <div className="grid grid-cols-2 gap-4">
        {options.map(({ value, label, icon }, index) => {
          const optionId = `${idPrefix}-${index}`;
          const isChecked = selectedOptions.includes(value);
          return (
            <div key={`${value}-${index}`}>
              <div
                className="w-fit flex items-center hover:cursor-pointer"
                onClick={() => toggleOption(value)}
              >
                <input
                  type="checkbox"
                  id={optionId}
                  name={name}
                  checked={isChecked}
                  value={value}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 hover:cursor-pointer"
                />
                <label
                  htmlFor={id}
                  className="ml-2 gap-x-2 flex items-center select-none text-gray-700 hover:cursor-pointer"
                >
                  {icon && <span className={icon}></span>}
                  {label}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
