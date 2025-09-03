"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { Lokasi, TitikLokasi } from "@/types/utils"; // ✅ import your types

const DeleteTitikLokasi: React.FC = () => {
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]); // ✅ typed
  const [selectedLokasi, setSelectedLokasi] = useState("");
  const [selectedTitik, setSelectedTitik] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch lokasi + titik lokasi
  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const res = await fetch("/api/lokasi");
        const data: Lokasi[] = await res.json(); // ✅ assert type

        if (res.ok) {
          console.log("Lokasi API result:", data);
          setLokasiList(data);
        } else {
          const errorData = data as { error?: string };
          throw new Error(errorData.error || "Gagal memuat lokasi");
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

  // Get titik_lokasi for the selected lokasi
  const titikOptions =
    lokasiList.find((lok) => String(lok.lokasi_id) === selectedLokasi)
      ?.titik_lokasi.map((t: TitikLokasi) => ({
        value: String(t.id_titik_lokasi),
        label: t.nama_titik_lokasi,
      })) || [];

  // Handle delete
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTitik) {
      setMessage("❌ Pilih titik lokasi terlebih dahulu!");
      return;
    }

    if (!confirm("Yakin ingin menghapus titik lokasi ini?")) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/titik-lokasi/${selectedTitik}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus titik lokasi");

      setMessage("✅ Titik lokasi berhasil dihapus!");
      setSelectedTitik("");
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
        onSubmit={handleDelete}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
      >
        <h2 className="text-xl font-bold text-gray-800">Hapus Titik Lokasi</h2>

        {/* Lokasi Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Lokasi
          </label>
          <Dropdown
            value={selectedLokasi}
            onChange={(e) => {
              setSelectedLokasi(e.target.value);
              setSelectedTitik(""); // reset titik when lokasi changes
            }}
            options={lokasiList.map((lok) => ({
              value: String(lok.lokasi_id),
              label: lok.nama_lokasi,
            }))}
            textTemplate="-- Pilih Lokasi --"
          />
        </div>

        {/* Titik Lokasi Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Titik Lokasi
          </label>
          <Dropdown
            value={selectedTitik}
            onChange={(e) => setSelectedTitik(e.target.value)}
            options={titikOptions}
            textTemplate="-- Pilih Titik Lokasi --"
          />
        </div>

        {/* Delete Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition disabled:bg-gray-400"
        >
          {loading ? "Menghapus..." : "Hapus Titik Lokasi"}
        </button>

        {message && (
          <p className="text-sm text-center font-medium mt-2">{message}</p>
        )}
      </form>
    </div>
  );
};

export default DeleteTitikLokasi;
