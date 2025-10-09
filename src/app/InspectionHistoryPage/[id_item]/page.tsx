"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "../../../components/Dropdown";
import { useParams, useRouter } from "next/navigation"; // ✅ import router
import CameraCapture from "@/components/CameraCapture";
import {
  InspectionResponse,
  formatColumnName,
  formatJenisSarana,
} from "@/types/utils";
import toast from "react-hot-toast"; 

const InspectionHistoryPage = () => {
  const { id_item } = useParams();
  const router = useRouter(); // ✅ initialize router

  const [inspectionData, setInspectionData] = useState<InspectionResponse | null>(null);
  const [status, setStatus] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id_item) return;

    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/form-inspeksi/${id_item}`);
        const data: InspectionResponse = await res.json();
        setInspectionData(data);
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id_item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id_item) return;

    try {
      setIsSubmitting(true);

      const formDataToSend = new FormData();
      formDataToSend.append("id", id_item as string);

      Object.entries(status).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });

      if (photo) {
        const blob = await fetch(photo).then((res) => res.blob());
        formDataToSend.append("gambar", blob, "inspection.jpg");
      }

      const res = await fetch(`/api/form-inspeksi/${id_item}`, {
        method: "POST",
        body: formDataToSend,
      });

      const result = await res.json();
      // console.log(result);
      toast.success("Berhasil dikirim ke database!");
      router.push("/ItemsPage"); 
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Gagal mengirim data!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#08333C]"></div>
        <span className="ml-4 text-lg font-medium">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-black p-6 flex flex-col items-center">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#08333C] mb-2 drop-shadow">
          Inspeksi {formatJenisSarana(inspectionData?.inspeksiTable)}
        </h1>
        <p className="text-gray-600">
          Formulir Inspeksi {formatJenisSarana(inspectionData?.inspeksiTable)}
        </p>
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
          ?.filter(
            (col) =>
              !["id_item", "id_inspeksi", "createdAt", "gambar"].includes(
                col.column_name
              )
          )
          .map((col, index) => (
            <div
              key={index}
              className="w-full flex flex-row items-center justify-between gap-4 px-4"
            >
              <span className="text-base font-medium">
                {formatColumnName(col.column_name)}
              </span>
              <Dropdown
                value={status[col.column_name] || "Status Condition"}
                onChange={(e) =>
                  setStatus((prev) => ({
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
          <CameraCapture onCapture={(img) => setPhoto(img)} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 px-6 py-3 font-semibold rounded-full shadow transition-all duration-200 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#51B5DD] hover:bg-[#429fc2] text-white"
          }`}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
};

export default InspectionHistoryPage;
