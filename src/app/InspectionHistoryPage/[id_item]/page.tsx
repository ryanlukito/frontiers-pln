"use client";

import React, {useState, useEffect} from "react";
import Dropdown from "../../../components/Dropdown";
// import { Item } from "@/types/utils";
import { useParams } from "next/navigation";
import CameraCapture from "@/components/CameraCapture";
import { InspectionResponse } from "@/types/utils";
import { formatColumnName } from "@/types/utils";

const InspectionHistoryPage = () => {

  const {id_item} = useParams();
  const [inspectionData, setInspectionData] = useState<InspectionResponse | null>(null);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id_item) return;

    const fetchItem = async () => {
    const res = await fetch(`/api/form-inspeksi/${id_item}`);
    const data: InspectionResponse = await res.json();
    setInspectionData(data);
    console.log(data)
  };

    fetchItem();
  }, [id_item]);
  // console.log(item)

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!id_item) return;

  //   const formData = {
  //     ...status,
  //     gambar: photo,
  //   };

  //   try {
  //     const res = await fetch(`/api/form-inspeksi/${id_item}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         id: id_item,
  //         formData,
  //       }),
  //     });

  //     const result = await res.json();

  //     if (!res.ok) {
  //       console.error("Error:", result.error);
  //       alert("Gagal menyimpan data: " + result.error);
  //       return;
  //     }

  //     console.log("Berhasil submit:", result);
  //     alert("Inspeksi berhasil disimpan!");
  //   } catch (error) {
  //     console.error("Submit error:", error);
  //     alert("Terjadi keselahan server")
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id_item) return;

    const formDataToSend = new FormData();
    formDataToSend.append("id", id_item as string);

    // send each status key/value individually
    Object.entries(status).forEach(([key, value]) => {
      formDataToSend.append(key, String(value)); // "true" / "false"
    });

    if (photo) {
      const blob = await fetch(photo).then(res => res.blob());
      formDataToSend.append("gambar", blob, "inspection.jpg");
    }

    const res = await fetch(`/api/form-inspeksi/${id_item}`, {
      method: "POST",
      body: formDataToSend,
    });

    const result = await res.json();
    console.log(result);
    alert("Berhasil dikirim ke database!")
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
        <div className="w-full h-0.5 bg-black" />
        <div className="w-full flex items-center justify-between px-4 text-sm font-semibold text-gray-800">
          <span>Elemen</span>
          <span>Status Inspeksi</span>
        </div>
        <div className="w-full h-0.5 bg-black" />
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl flex flex-col gap-6 items-center"
      >
        {inspectionData?.columns
        ?.filter((col) => !["id_item", "id_inspeksi", "createdAt", "gambar"].includes(col.column_name))
        .map((col, index) => (
          <div
            key={index}
            className="w-full flex flex-row items-center justify-between gap-4 px-4"
          >
            {/* Column label */}
            <span className="text-base font-medium">
              {formatColumnName(col.column_name)}
            </span>

            {/* Dropdown for status */}
            <Dropdown
              value={status[col.column_name] || "Status Condition"}
              onChange={(e) => setStatus((prev) => ({
                ...prev,
                [col.column_name]: e.target.value,
              }))
            }
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              textTemplate="Status Condition"
            />
          </div>
        ))}
        <div className="w-full h-full">
          <CameraCapture onCapture={(img) => setPhoto(img)}/>
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
