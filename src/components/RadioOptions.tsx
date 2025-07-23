import { RadioOptionProps } from "../types/utils";

const RadioOption = ({
  name,
  value,
  checked,
  onChange,
  label,
}: RadioOptionProps) => {
  return (
    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
      />
      <span>{label}</span>
    </label>
  );
};

export default RadioOption;
