"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Barchart from "../../components/Barchart";
import RadialProgressChart from "../../components/RadialProgress";
import Dropdown from "@/components/Dropdown";

const DashboardPage = () => {
  const [overallPercentage, setOverallPercentage] = useState<number>(0);
  const [lokasiData, setLokasiData] = useState<any[]>([]);
  const [selectedJenis, setSelectedJenis] = useState("");
  const [jenisData, setJenisData] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const bulan = new Date().getMonth() + 1;
  const tahun = new Date().getFullYear();

  const handleJenisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJenis(e.target.value);
  };

  const selectedLokasiData = lokasiData.find(
    (lok) => lok.lokasi === selectedLocation
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/rekapitulasi?bulan=${bulan}&tahun=${tahun}`);
        const data = await res.json();
        setOverallPercentage(parseFloat(data.overall.persentase_siap));
        setLokasiData(data.per_lokasi || []);
        setJenisData(data.per_jenis || []);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchData();
  }, [bulan, tahun]);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-white text-black overflow-x-hidden">
      <Navbar />
      <div className="w-full max-w-7xl flex flex-col items-center px-4 py-6 gap-4">
        {/* Top Section */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          {/* Overall Percentage */}
          <div className="w-full md:w-1/2 p-4 border-2 text-center flex flex-col items-center">
            <RadialProgressChart percentage={overallPercentage} />
            <h1>
              Persentase{" "}
              <span className="font-bold">
                Kesiapan Alat Secara Keseluruhan
              </span>
            </h1>
          </div>

          {/* Location-specific Readiness */}
          <div className="w-full md:w-1/2 flex flex-col items-center border-2 p-4">
            <div className="w-full flex justify-end mb-3 gap-3">
              <button 
                className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100" 
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
              <button className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100">
                Save to PDF
              </button>
            </div>
            <h1 className="text-center mb-4">
              Kesiapan Alat{" "}
              <span className="font-bold">berdasarkan Lokasi</span>
            </h1>

            {/* Dropdown Lokasi */}
            <Dropdown
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              options={lokasiData.map((lok) => ({
                label: lok.lokasi,
                value: lok.lokasi,
              }))}
              textTemplate="Pilih Lokasi"
            />

            {/* RadialProgress sesuai lokasi */}
            <div className="mt-6">
              {selectedLokasiData ? (
                <div className="flex flex-col items-center">
                  <RadialProgressChart
                    percentage={parseFloat(selectedLokasiData.persentase_siap)}
                  />
                  <h1 className="text-center">
                    Persentase{" "}
                    <span className="font-bold">Kesiapan {selectedLokasiData.lokasi}</span>
                  </h1>
                </div>
              ) : (
                <p className="italic text-gray-500 mt-4">Silakan pilih lokasi</p>
              )}
            </div>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="w-full border-2 px-4 py-6 flex flex-col items-center gap-6">
          {/* Jenis Sarana */}
          <div className="flex flex-row items-center justify-center gap-x-5">
          <h1 className="text-center font-medium">
            Kesiapan Alat Berdasarkan Jenis Sarana
          </h1>
          <Dropdown
            value={selectedJenis}
            onChange={handleJenisChange}
            options={jenisData.map((j) => ({
              label: j.jenis_sarana,
              value: j.jenis_sarana,
            }))}
            textTemplate="Pilih Jenis Sarana"
          />
        </div>
        <Barchart jenis={selectedJenis} bulan={bulan} tahun={tahun} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
