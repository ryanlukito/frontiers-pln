"use client";

import { useState } from "react";
import { FormData } from "../../types/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import InputField from "../../components/InputField";
import RadioOption from "../../components/RadioOptions";

const AddNewItemPage = () => {
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    serialNumber: "",
    locationPoint: "",
    locationId: "",
    specification: "",
    installationDate: "",
    supplier: "",
    pic: "",
    installationStatus: "terpasang",
    file: null,
  });

  // Handler for input changes with typed events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files ? files[0] : null,
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Handler for form submission with typed events
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real Next.js app, you would typically send this to an API route
    // For example: await fetch('/api/items', { method: 'POST', body: JSON.stringify(formData) });
    console.log("Form Submitted:", formData);
    // You would replace alert with a proper notification system (e.g., react-hot-toast)
    alert("Form submitted! Check the console for the data.");
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Tambah Item Baru
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name Input */}
          <InputField
            name="itemName"
            placeholder="Nama Item"
            value={formData.itemName}
            onChange={handleChange}
          />

          {/* Serial Number Input */}
          <InputField
            name="serialNumber"
            placeholder="Nomor Seri"
            value={formData.serialNumber}
            onChange={handleChange}
          />

          {/* Location Point Input */}
          <InputField
            name="locationPoint"
            placeholder="Titik Lokasi"
            value={formData.locationPoint}
            onChange={handleChange}
          />

          {/* Location ID Input */}
          <InputField
            name="locationId"
            placeholder="ID Lokasi"
            value={formData.locationId}
            onChange={handleChange}
          />

          {/* Specification Input */}
          <InputField
            name="specification"
            placeholder="Spesifikasi"
            value={formData.specification}
            onChange={handleChange}
          />

          {/* Date Input */}
          <div className="relative">
            <InputField
              name="installationDate"
              placeholder="MM/DD/YY"
              value={formData.installationDate}
              onChange={handleChange}
              type="date"
              className="pr-10"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Supplier Input */}
          <InputField
            name="supplier"
            placeholder="Pemasok"
            value={formData.supplier}
            onChange={handleChange}
          />

          {/* PIC Input */}
          <InputField
            name="pic"
            placeholder="PIC"
            value={formData.pic}
            onChange={handleChange}
          />

          {/* Installation Status Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pemasangan:
            </label>
            <div className="flex items-center space-x-6">
              <RadioOption
                name="installationStatus"
                value="terpasang"
                checked={formData.installationStatus === "terpasang"}
                onChange={handleChange}
                label="Terpasang"
              />
              <RadioOption
                name="installationStatus"
                value="belum_terpasang"
                checked={formData.installationStatus === "belum_terpasang"}
                onChange={handleChange}
                label="Belum Terpasang"
              />
            </div>
          </div>

          {/* File Input */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              name="file"
              type="file"
              className="sr-only"
              onChange={handleChange}
            />
            <span className="text-sm text-gray-500">
              {formData.file ? formData.file.name : "No File Chosen"}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#32A38C] text-white font-bold py-3 px-4 rounded-md hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewItemPage;
