"use client";

import React, {useState, useEffect} from "react";
import Dropdown from "../../../components/Dropdown";
import { Item } from "@/types/utils";
import { useParams } from "next/navigation";

const InspectionHistoryPage = () => {

  const {id_item} = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!id_item) return;

    const fetchItem = async () => {
      const res = await fetch(`/api/items/${id_item}`);
      const data = await res.json();
      setItem(data);
    };

    fetchItem();
  }, [id_item]);
  console.log(item)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("submit inspection for:", item);
  };

  return (
    <div className="min-h-screen w-full bg-white text-black p-6 flex flex-col items-center">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#08333C] mb-2 drop-shadow">
          Inspeksi Alat Pemadam Api Portabel
        </h1>
        <p className="text-gray-600">Formulir Inspeksi Alat Pemadam Api</p>
      </div>

      {/* Header Divider */}
      <div className="w-full max-w-4xl flex flex-col gap-2 items-center mb-4">
        <div className="w-full h-0.5 bg-gray-300" />
        <div className="w-full flex items-center justify-between px-4 text-sm font-semibold text-gray-800">
          <span>Elemen</span>
          <span>Status Inspeksi</span>
        </div>
        <div className="w-full h-0.5 bg-gray-300" />
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl flex flex-col gap-6 items-center"
      >
        {/* Sample Form Row */}
        <div className="w-full flex flex-row items-center justify-between gap-4 px-4">
          <span className="text-base font-medium">APAR - ABC</span>
          <Dropdown
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-[#51B5DD] hover:bg-[#429fc2] text-white font-semibold rounded-full shadow transition-all duration-200"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default InspectionHistoryPage;
