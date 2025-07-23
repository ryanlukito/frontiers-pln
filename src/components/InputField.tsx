import { InputFieldProps } from "../types/utils";

const InputField = ({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}: InputFieldProps) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow duration-200 ${className} text-black`}
    />
  );
};

export default InputField;
