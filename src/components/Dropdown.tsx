import React from "react";
import { DropdownProps } from "../types/utils";
import clsx from "clsx"; // optional helper for merging class names

interface ExtendedDropdownProps extends DropdownProps {
  className?: string; // allow custom className
}

const Dropdown: React.FC<ExtendedDropdownProps> = ({
  value,
  onChange,
  options,
  textTemplate,
  className,
}) => {
  return (
    <select
      value={value === "Status Condition" ? "" : value}
      onChange={onChange}
      className={clsx(
        "border py-[0.5vw] px-[1vw] rounded-md flex items-center justify-center",
        className
      )}
    >
      <option value="" disabled>
        {textTemplate}
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
