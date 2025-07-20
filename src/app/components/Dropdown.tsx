import React from "react";
import { DropdownProps } from "../types/utils";

const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options }) => {
  return (
    <select
      value={value === "Status Condition" ? "" : value}
      onChange={onChange}
      className="border py-[0.5vw] px-[1vw] rounded-md flex items-center justify-center"
    >
      <option value="" disabled>
        Status Condition...
      </option>
      {options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
