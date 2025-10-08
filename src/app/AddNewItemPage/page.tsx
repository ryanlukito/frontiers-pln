"use client";

import { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import RadioOption from "../../components/RadioOptions";
import { Lokasi, jenisSarana } from "@/types/utils";
import { useSession } from "next-auth/react";

const AddNewItemPage = () => {
  const { data: session } = useSession();
  console.log("Session Data: ", session);
  const [formData, setFormData] = useState({
    itemName: "",
    serialNumber: "",
    locationPoint: "",
    locationId: "",
    specification: "",
    purchaseDate: "",
    expiryDate: "",
    weight: "",
    apapType: "",
    supplier: "",
    pic: "",
    installationStatus: "Terpasang",
    jenisSarana: "",
    file: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [selectedLokasi, setSelectedLokasi] = useState<string>("");

  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const res = await fetch("/api/lokasi", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch lokasi");
        const data = await res.json();
        setLokasiList(data);
      } catch (error) {
        console.error("Error fetching lokasi:", error);
        setMessage("Gagal memuat daftar lokasi");
      }
    };

    fetchLokasi();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    // 🔹 Input type file
    if (target instanceof HTMLInputElement && target.type === "file") {
      const { name, files } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: files && files[0] ? files[0] : null,
      }));
      return;
    }

    // 🔹 Lainnya
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_item", formData.itemName);
      formDataToSend.append("nomor_ser", formData.serialNumber);
      formDataToSend.append("lokasi_id", formData.locationId);
      formDataToSend.append("id_titik_lokasi", formData.locationPoint);
      formDataToSend.append("spesifikasi", formData.specification);
      formDataToSend.append("tanggal_pembelian", formData.purchaseDate || "");
      formDataToSend.append(
        "tanggal_kadaluwarsa",
        formData.jenisSarana === "APAP" ? formData.expiryDate || "" : ""
      );
      formDataToSend.append(
        "berat",
        formData.jenisSarana === "APAP" ? formData.weight || "" : ""
      );
      formDataToSend.append(
        "jenis_APAP",
        formData.jenisSarana === "APAP" ? formData.apapType || "" : ""
      );
      formDataToSend.append("pemasok", formData.supplier);
      formDataToSend.append("PIC", formData.pic);
      formDataToSend.append("status_pemasangan", formData.installationStatus);
      formDataToSend.append("jenis_sarana", formData.jenisSarana);

      if (formData.file) {
        formDataToSend.append("gambar", formData.file); // ✅ file asli, bukan cuma nama
      }

      if (session?.user?.email) {
        formDataToSend.append("uploadedBy", session.user.email);
      }

      const res = await fetch("/api/items", {
        method: "POST",
        body: formDataToSend, // ✅ jangan kasih Content-Type manual
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan item");
      } else {
        setMessage("✅ Item berhasil disimpan!");
        setFormData({
          itemName: "",
          serialNumber: "",
          locationPoint: "",
          locationId: "",
          specification: "",
          purchaseDate: "",
          expiryDate: "",
          weight: "",
          apapType: "",
          supplier: "",
          pic: "",
          installationStatus: "Terpasang",
          jenisSarana: "",
          file: null,
        });
        setSelectedLokasi("");
        // console.log(data);
      }
    } catch (err) {
      console.error(err);
      setMessage("🔥 Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Tambah Item Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Item */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
          <InputField
            name="itemName"
            placeholder="Nama Item"
            value={formData.itemName}
            onChange={handleChange}
          />

          {/* Nomor Seri */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Seri</label>
          <InputField
            name="serialNumber"
            placeholder="Nomor Seri"
            value={formData.serialNumber}
            onChange={handleChange}
          />

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Lokasi
            </label>
            <select
              name="locationId"
              value={formData.locationId}
              onChange={(e) => {
                handleChange(e);
                setSelectedLokasi(e.target.value);
                setFormData((prev) => ({ ...prev, locationPoint: "" }));
              }}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            >
              <option value="" disabled hidden>
                Pilih Lokasi
              </option>
              {lokasiList.map((lokasi) => (
                <option key={lokasi.lokasi_id} value={lokasi.lokasi_id}>
                  {lokasi.nama_lokasi}
                </option>
              ))}
            </select>
          </div>

          {/* Titik Lokasi */}
          {selectedLokasi && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Titik Lokasi
              </label>
              <select
                name="locationPoint"
                value={formData.locationPoint}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              >
                <option value="" disabled hidden>
                  Pilih Titik Lokasi
                </option>
                {lokasiList
                  .find(
                    (lokasi) =>
                      String(lokasi.lokasi_id) === String(selectedLokasi)
                  )
                  ?.titik_lokasi.map((titik) => (
                    <option
                      key={titik.id_titik_lokasi}
                      value={titik.id_titik_lokasi}
                    >
                      {titik.nama_titik_lokasi}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Jenis Sarana */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Sarana
            </label>
            <select
              name="jenisSarana"
              value={formData.jenisSarana}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
              // size={3}
            >
              <option value="" disabled hidden>
                Pilih jenis sarana
              </option>
              {jenisSarana.map((item, index) => (
                  <option value={item.value} key={index}>
                    {item.nama}
                  </option>
              ))}
            </select>
          </div>

          {/* Jika jenis sarana = APAP → tampilkan field tambahan */}
          {formData.jenisSarana === "APAP" && (
            <>
              <label htmlFor="">Expiry Date</label>
              <InputField
                name="expiryDate"
                type="date"
                placeholder="Tanggal Kadaluwarsa"
                value={formData.expiryDate}
                onChange={handleChange}
              />

              <label htmlFor="">Weight</label>
              <InputField
                name="weight"
                type="number"
                placeholder="Berat (kg)"
                value={formData.weight}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis APAP
                </label>
                <select
                  name="apapType"
                  value={formData.apapType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="" disabled hidden>
                    Pilih jenis APAP
                  </option>
                  <option value="GAS_CAIR_NON_HALON">Gas Cair Non-Halon</option>
                  <option value="POWDER">Powder</option>
                  <option value="CO2">CO2</option>
                  <option value="LITHIUM">Lithium</option>
                </select>
              </div>
            </>
          )}
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Spesifikasi</label>
          <InputField
            name="specification"
            placeholder="Spesifikasi"
            value={formData.specification}
            onChange={handleChange}
          />
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <InputField
            name="purchaseDate"
            type="date"
            placeholder="Tanggal Pembelian"
            value={formData.purchaseDate}
            onChange={handleChange}
          />
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Pemasok</label>
          <InputField
            name="supplier"
            placeholder="Pemasok"
            value={formData.supplier}
            onChange={handleChange}
          />
          
          <label className="block text-sm font-medium text-gray-700 mb-1">PIC</label>
          <InputField
            name="pic"
            placeholder="PIC"
            value={formData.pic}
            onChange={handleChange}
          />

          {/* Status Pemasangan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pemasangan:
            </label>
            <div className="flex items-center space-x-6">
              <RadioOption
                name="installationStatus"
                value="Terpasang"
                checked={formData.installationStatus === "Terpasang"}
                onChange={handleChange}
                label="Terpasang"
              />
              <RadioOption
                name="installationStatus"
                value="Belum Terpasang"
                checked={formData.installationStatus === "Belum Terpasang"}
                onChange={handleChange}
                label="Belum Terpasang"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              name="file"
              type="file"
              className="sr-only"
              onChange={handleChange}
            />
            <span className="text-sm text-gray-500">
              {formData.file ? formData.file.name : "No File Chosen"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#32A38C] text-white font-bold py-3 px-4 rounded-md hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Submit"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddNewItemPage;
