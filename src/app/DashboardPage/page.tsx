"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Barchart from "../../components/Barchart";
import RadialProgressChart from "../../components/RadialProgress";
import Dropdown from "@/components/Dropdown";

const monthOptions = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "Mei", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "Desember", value: 12 },
];

const DashboardPage = () => {
const [overallPercentage, setOverallPercentage] = useState<number>(0);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const previousDate = new Date();
  previousDate.setMonth(currentDate.getMonth() - 1);
  const previousMonth = previousDate.getMonth() + 1;
  const previousYear = previousDate.getFullYear();

  const [previousMonthPercentage, setPreviousMonthPercentage] = useState<number>(0); // Added for the first radial chart
  const [lokasiData, setLokasiData] = useState<any[]>([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  const [jenisData, setJenisData] = useState<any[]>([]);
  // const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const handleJenisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJenis(e.target.value);
  };

  const handleExportPDF = async () => {
    try {
      const res = await fetch('/api/export-pdf', {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Gagal generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "rekapitulasi.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export PDF error:", err);
      alert("Gagal generate PDF, cek server log");
    }
  };

  // Keep the original selectedLokasiData logic if it's used elsewhere for display
  // const selectedLokasiData = lokasiData.find(
  //   (lok) => lok.lokasi === selectedLocation
  // );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/rekapitulasi?bulan=${selectedMonth}&tahun=${currentYear}`);
        const data = await res.json();

        setOverallPercentage(parseFloat(data.overall?.persentase_siap) || 0);
        setLokasiData(data.per_lokasi || []);
        setJenisData(data.per_jenis || []);

        // fetch previous month based on selectedMonth
        const prevDate = new Date(currentYear, selectedMonth - 2); // -2 because month index starts from 0
        const prevMonth = prevDate.getMonth() + 1;
        const prevYear = prevDate.getFullYear();

        const prevRes = await fetch(`/api/rekapitulasi?bulan=${prevMonth}&tahun=${prevYear}`);
        const prevData = await prevRes.json();
        setPreviousMonthPercentage(parseFloat(prevData.overall?.persentase_siap) || 0);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchData();
  }, [selectedMonth, currentYear]);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-white text-black overflow-x-hidden">
      <Navbar />
      <div className="w-full flex justify-end gap-3 px-6 mt-4">
        <button 
          className="text-sm px-4 py-2 border rounded-md bg-white text-gray-800 hover:bg-gray-100 shadow-sm transition"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
        <button 
          className="text-sm px-4 py-2 border rounded-md bg-teal-500 text-white hover:bg-teal-600 shadow-sm transition"
          onClick={handleExportPDF}
        >
          Save to PDF
        </button>
      </div>
      <div className="w-full flex flex-col items-center py-6 gap-4">
        {/* Top Section */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          {/* Overall Percentage */}
          <div className="w-full text-center py-6">
            <h1 className="text-2xl text-gray-800 mb-8">Kesiapan Secara <span className="font-bold">Keseluruhan</span></h1>
            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-12">
            {/* Previous Month Percentage */}
              <div className="flex flex-col items-center gap-4">
                <RadialProgressChart percentage={previousMonthPercentage} /> {/* Uses previousMonthPercentage */}
                <p className="text-gray-600 text-sm">Persentase Bulan Sebelumnya</p>
            </div>
            {/* Current Month Percentage */}
            <div className="flex flex-col items-center gap-4">
              <RadialProgressChart percentage={overallPercentage} /> {/* Uses overallPercentage */}
              <p className="text-gray-600 text-sm">Persentase Saat ini</p>
            </div>
          </div>
        </div>
        </div>

        {/* Bar Chart Section */}
        <div className="w-full border-2 px-4 py-6 flex flex-col items-center gap-6 bg-[#08333C]">
          {/* Jenis Sarana */}
          <div className="flex flex-row items-center justify-center gap-x-5">
          {/* <h1 className="text-center font-medium">
            Kesiapan Alat Berdasarkan Jenis Sarana
          </h1> */}
          <Dropdown
            value={String(selectedMonth)}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            options={monthOptions.map((m) => ({
              label: m.label,
              value: String(m.value),
            }))}
            textTemplate="Pilih Bulan"
            className="border border-white bg-white rounded-sm"
          />
          <Dropdown
            value={selectedJenis}
            onChange={handleJenisChange}
            options={jenisData.map((j) => ({
              label: j.jenis_sarana,
              value: j.jenis_sarana,
            }))}
            textTemplate="Pilih Jenis Sarana"
            className="border border-white bg-white"
          />
        </div>
        {jenisData.length > 0 ? (
          <Barchart jenis={selectedJenis} bulan={selectedMonth} tahun={currentYear} />
        ) : (
          <p className="text-white text-sm">Tidak ada data untuk bulan ini</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
