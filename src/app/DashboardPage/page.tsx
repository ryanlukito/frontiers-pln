"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Barchart from "../../components/Barchart";
import RadialProgressChart from "../../components/RadialProgress";
import Dropdown from "@/components/Dropdown";

const DashboardPage = () => {

  const [selectedLocation, setSelectedLocation] = useState("Banjarmasin");

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  }

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-white text-black overflow-x-hidden">
      <Navbar />
      <div className="w-full max-w-7xl flex flex-col items-center px-4 py-6 gap-4">
        {/* Top Section */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          {/* Overall Percentage */}
          <div className="w-full md:w-1/2 p-4 border-2 text-center flex flex-col items-center">
            <RadialProgressChart percentage={79} />
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
              <button className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100">
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
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex flex-col items-center">
                <RadialProgressChart percentage={50} />
                <h1 className="text-center">
                  Persentase{" "}
                  <span className="font-bold">Kesiapan Kota Banjarmasin</span>
                </h1>
              </div>
              <div className="flex flex-col items-center">
                <RadialProgressChart percentage={50} />
                <h1 className="text-center">
                  Persentase{" "}
                  <span className="font-bold">Kesiapan Kota Yogyakarta</span>
                </h1>
              </div>
            </div>
            <button className="mt-4 italic underline text-sm">
              Lihat Semua
            </button>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="w-full border-2 px-4 py-6 flex flex-col items-center">
          <h1 className="mb-4 text-center font-medium">
            Kesiapan Alat Jenis Sarana
          </h1>
          <Dropdown
              value={selectedLocation}
              onChange={handleLocationChange}
              options={[
                { label: "Banjarmasin", value: "Banjarmasin" },
                { label: "Yogyakarta", value: "Yogyakarta" },
                { label: "Jakarta", value: "Jakarta" },
              ]}
              textTemplate="Pilih Lokasi"
            />
          <Barchart location={selectedLocation} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
