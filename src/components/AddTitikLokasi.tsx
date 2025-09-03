"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { MainLokasi } from "@/types/utils";

const AddTitikLokasi: React.FC = () => {
  const [lokasiList, setLokasiList] = useState<{ value: string; label: string }[]>([]);
  const [selectedLokasi, setSelectedLokasi] = useState("");
  const [namaTitik, setNamaTitik] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch lokasi for dropdown
  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const res = await fetch("/api/lokasi");
        const data: MainLokasi[] = await res.json();

        if (res.ok) {
          setLokasiList(
            data.map((lokasi) => ({
              value: lokasi.id ?? lokasi.lokasi_id ?? "", // make sure API returns "id"
              label: lokasi.nama_lokasi,
            }))
          );
        } else {
          throw new Error("Gagal memuat lokasi");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
        } else {
          setMessage("❌ An unknown error occurred");
        }
      }
    };

    fetchLokasi();
  }, []);

  // Handle submit titik lokasi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLokasi) {
      setMessage("❌ Pilih lokasi terlebih dahulu!");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/titik-lokasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lokasi_id: selectedLokasi,
          nama_titik_lokasi: namaTitik,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan titik lokasi");

      setMessage("✅ Titik lokasi berhasil ditambahkan!");
      setNamaTitik("");
      setSelectedLokasi("");
    } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
        } else {
          setMessage("❌ An unknown error occurred");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80%] flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
      >
        <h2 className="text-xl font-bold text-gray-800">Tambah Titik Lokasi Baru</h2>

        {/* Lokasi Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Lokasi
          </label>
          <Dropdown
            value={selectedLokasi}
            onChange={(e) => setSelectedLokasi(e.target.value)}
            options={lokasiList}
            textTemplate="-- Pilih Lokasi --"
          />
        </div>

        {/* Nama Titik */}
        <div>
          <label htmlFor="namaTitik" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Titik Lokasi
          </label>
          <input
            type="text"
            id="namaTitik"
            value={namaTitik}
            onChange={(e) => setNamaTitik(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama titik lokasi"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#32A38C] text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Tambah Titik Lokasi"}
        </button>

        {message && (
          <p className="text-sm text-center font-medium mt-2">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddTitikLokasi;
