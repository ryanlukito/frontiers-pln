"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Barchart from "../../components/Barchart";
import RadialProgressChart from "../../components/RadialProgress";
import Dropdown from "@/components/Dropdown";
import { formatJenisSarana, LokasiData, JenisData, TelegramResponse } from "@/types/utils";

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
  // const previousMonth = previousDate.getMonth() + 1;
  // const previousYear = previousDate.getFullYear();

  const [previousMonthPercentage, setPreviousMonthPercentage] = useState<number>(0); // Added for the first radial chart
  const [lokasiData, setLokasiData] = useState<LokasiData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationPercentage, setLocationPercentage] = useState<number>(0);

  const [selectedJenis, setSelectedJenis] = useState("");
  const [jenisData, setJenisData] = useState<JenisData[]>([]);
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

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const loc = e.target.value;
    setSelectedLocation(loc);

    const locData = lokasiData.find((l) => l.lokasi === loc);
    setLocationPercentage(parseFloat(String(locData?.persentase_siap)) || 0);
  }

  const handleSendTelegram = async () => {
    try {
      const bulanLabel =
        monthOptions.find((m) => m.value === selectedMonth)?.label || "";
      // const jenisLabel = selectedJenis
      //   ? formatJenisSarana(selectedJenis)
      //   : "Semua Jenis";

      // === build message for all lokasi ===
      const lokasiLines =
        lokasiData.length > 0
          ? lokasiData
              .map(
                (loc) =>
                  `• ${loc.lokasi}: ${parseFloat(
                    String(loc.persentase_siap)
                  ).toFixed(2)}%`
              )
              .join("\n")
          : "- Tidak ada data lokasi -";

      // === build message for all jenis sarana ===
      const jenisLines =
        jenisData.length > 0
          ? jenisData
              .map(
                (j) =>
                  `• ${formatJenisSarana(j.jenis_sarana)}: ${parseFloat(
                    String(j.persentase_siap)
                  ).toFixed(2)}%`
              )
              .join("\n")
          : "- Tidak ada data jenis sarana -";

      // === Final message ===
      const message = `📊 Rekapitulasi Kesiapan
        Bulan: ${bulanLabel} ${currentYear}

        🔹 Persentase Keseluruhan: ${overallPercentage}%

        🏢 Berdasarkan Lokasi:
        ${lokasiLines}

        🔧 Berdasarkan Jenis Sarana:
        ${jenisLines}`;

      const res = await fetch("/api/sendToTelegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data: TelegramResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal kirim pesan");
      }

      alert(data.message ?? "Pesan berhasil dikirim!");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Telegram Error:", err.message);
        alert(`Gagal kirim ke Telegram: ${err.message}`);
      } else {
        console.error("Unexpected error:", err);
        alert("Terjadi error yang tidak diketahui");
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/rekapitulasi?bulan=${selectedMonth}&tahun=${currentYear}`);
        const data = await res.json();

        setOverallPercentage(parseFloat(data.overall?.persentase_siap) || 0);
        setLokasiData(data.per_lokasi || []);
        setJenisData(data.per_jenis || []);
        // console.log(data.per_jenis);

        if (data.per_lokasi?.length > 0 && !selectedLocation) {
          setSelectedLocation(data.per_lokasi[0].lokasi);
          setLocationPercentage(parseFloat(data.per_lokasi[0].persentase_siap) || 0);
        }

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
  }, [selectedMonth, currentYear, selectedLocation]);

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
          onClick={handleSendTelegram}
          disabled={!selectedJenis || !selectedMonth} // ✅ disable if belum pilih
        >
          Telegram
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
            <div className="flex items-center justify-center">
              <div className="w-full flex flex-col md:flex-row justify-center items-center gap-12">
              {/* Previous Month Percentage */}
                <div className="flex flex-col items-center gap-4">
                  <p className="text-gray-600 text-sm">Persentase Bulan Sebelumnya</p>
                  <RadialProgressChart percentage={previousMonthPercentage} /> {/* Uses previousMonthPercentage */}
              </div>
              {/* Current Month Percentage */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-600 text-sm">Persentase Saat ini</p>
                <RadialProgressChart percentage={overallPercentage} /> {/* Uses overallPercentage */}
              </div>

              {/* NEW: Location Percentage */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-600 text-sm">Persentase Berdasarkan Lokasi</p>
                <RadialProgressChart percentage={locationPercentage} />
                <Dropdown
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  options={lokasiData.map((l) => ({
                    label: l.lokasi,
                    value: l.lokasi,
                  }))}
                  textTemplate="Pilih Lokasi"
                  className="border border-gray-300 bg-white rounded-sm"
                />
              </div>
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
              label: formatJenisSarana(j.jenis_sarana),
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
