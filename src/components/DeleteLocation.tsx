"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

const DeleteLocation: React.FC = () => {
  const [lokasiList, setLokasiList] = useState<{ value: string; label: string }[]>([]);
  const [selectedLokasi, setSelectedLokasi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch all lokasi
  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const res = await fetch("/api/lokasi");
        const data = await res.json();

        if (res.ok) {
          setLokasiList(
            data.map((lok: any) => ({
              value: String(lok.lokasi_id),
              label: lok.nama_lokasi,
            }))
          );
        } else {
          throw new Error(data.error || "Gagal memuat lokasi");
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

  // Handle delete
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLokasi) {
      setMessage("❌ Pilih lokasi terlebih dahulu!");
      return;
    }

    if (!confirm("Yakin ingin menghapus lokasi ini?")) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/lokasi?id=${selectedLokasi}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus lokasi");

      setMessage("✅ Lokasi berhasil dihapus!");
      // Remove deleted lokasi from dropdown
      setLokasiList((prev) => prev.filter((l) => l.value !== selectedLokasi));
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
        onSubmit={handleDelete}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
      >
        <h2 className="text-xl font-bold text-gray-800">Hapus Lokasi</h2>

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

        {/* Delete Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition disabled:bg-gray-400"
        >
          {loading ? "Menghapus..." : "Hapus Lokasi"}
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

export default DeleteLocation;
