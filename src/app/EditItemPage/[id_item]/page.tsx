"use client";

import { useEffect, useState } from "react";
import InputField from "../../../components/InputField";
import RadioOption from "../../../components/RadioOptions";
import { Lokasi } from "@/types/utils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const jenisSarana = [
  { nama: "APAP", value: "inspeksi_APAP" },
  { nama: "SCBA", value: "inspeksi_scba" },
  { nama: "Sprinkler", value: "inspeksi_sprinkler" },
  { nama: "Detektor", value: "inspeksi_detector" },
  { nama: "Hidran Bangunan", value: "inspeksi_hidran_bangunan" },
  { nama: "Hidran Halaman", value: "inspeksi_hidran_halaman" },
  { nama: "Rumah Pompa Hidran", value: "inspeksi_rumah_pompa_hidran" },
  { nama: "Sarana Jalan Keluar", value: "inspeksi_sarana_jalan_keluar" },
  { nama: "Kotak P3K", value: "inspeksi_kotak_p3k" },
  { nama: "Spill Containment Room", value: "inspeksi_spill_containment_room" },
  { nama: "Ruang MNS", value: "inspeksi_ruang_mns" },
  { nama: "Fire Ball", value: "inspeksi_fire_ball" },
  { nama: "CCTV", value: "inspeksi_cctv" },
];

const EditItemPage = () => {
  const { id_item } = useParams();
  const { data: session } = useSession();

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
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [selectedLokasi, setSelectedLokasi] = useState<string>("");

  // 🔹 Ambil data item existing
  useEffect(() => {
    const fetchItem = async () => {
        if (!id_item) return;
        const res = await fetch(`/api/items/${id_item}`);
        if (!res.ok) throw new Error("Gagal fetch item");

        const data = await res.json();
        setFormData({
            itemName: data.nama_item || "",
            serialNumber: data.nomor_ser || "",
            locationPoint: data.id_titik_lokasi || "",
            locationId: data.lokasi_id || "",
            specification: data.spesifikasi || "",
            purchaseDate: data.tanggal_pembelian || "",
            expiryDate: data.tanggal_kadaluwarsa || "",
            weight: data.berat || "",
            apapType: data.jenis_APAP || "",
            supplier: data.pemasok || "",
            pic: data.PIC || "",
            installationStatus: data.status_pemasangan ? "Terpasang" : "Belum Terpasang",
            jenisSarana: data.jenis_sarana || "",
        });
        setSelectedLokasi(data.lokasi_id?.toString() || "");
    };

    fetchItem();
  }, [id_item]);

  // 🔹 Ambil daftar lokasi
  useEffect(() => {
    const fetchLokasi = async () => {
      try {
        const res = await fetch("/api/lokasi");
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

  // 🔹 Handle perubahan input
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

  // 🔹 Submit data edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const payload = {
        nama_item: formData.itemName,
        nomor_ser: formData.serialNumber,
        lokasi_id: formData.locationId,
        id_titik_lokasi: formData.locationPoint,
        spesifikasi: formData.specification,
        tanggal_pembelian: formData.purchaseDate || null,
        tanggal_kadaluwarsa:
          formData.jenisSarana === "inspeksi_APAP"
            ? formData.expiryDate || null
            : null,
        berat:
          formData.jenisSarana === "inspeksi_APAP"
            ? formData.weight || null
            : null,
        jenis_APAP:
          formData.jenisSarana === "inspeksi_APAP"
            ? formData.apapType || null
            : null,
        pemasok: formData.supplier,
        PIC: formData.pic,
        status_pemasangan: formData.installationStatus === "Terpasang",
        jenis_sarana: formData.jenisSarana,
        uploadedBy: session?.user?.email || null,
      };

      const res = await fetch(`/api/items/${id_item}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal update item");
      } else {
        setMessage("✅ Item berhasil diupdate!");
        console.log(data);
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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Item</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
          <InputField
            name="itemName"
            placeholder="Nama Item"
            value={formData.itemName}
            onChange={handleChange}
          />

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

          {/* Field tambahan jika APAP */}
          {formData.jenisSarana === "inspeksi_APAP" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <InputField
                name="expiryDate"
                type="date"
                placeholder="Tanggal Kadaluwarsa"
                value={formData.expiryDate}
                onChange={handleChange}
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#32A38C] text-white font-bold py-3 px-4 rounded-md hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default EditItemPage;
