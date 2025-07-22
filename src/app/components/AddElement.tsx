import React from "react";
import { FaUpload } from "react-icons/fa6";
import { AddElementProps } from "../types/utils";

const AddElement: React.FC<AddElementProps> = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center gap-x-3">
      <button
        onClick={onClick}
        className="p-4 rounded-full bg-[#08333C] hover:cursor-pointer"
      >
        <FaUpload className="text-white" />
      </button>
      <div className="flex flex-col">
        <h1>Unggah Elemen</h1>
        <h1>Inspeksi Baru</h1>
      </div>
    </div>
  );
};

export default AddElement;
