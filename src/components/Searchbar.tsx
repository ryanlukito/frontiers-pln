import React from "react";
import { SearchbarProps } from "../types/utils";

const Searchbar: React.FC<SearchbarProps> = ({ value, onChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 w-[100%]"
      />
    </div>
  );
};

export default Searchbar;
