import { DateTime } from "next-auth/providers/kakao";

export type RadialProgressChartProps = {
  percentage: number;
};

export interface DropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | boolean}[];
  textTemplate?: string;
}

export interface TableItem {
  no: string;
  id_item: number;
  nama_item: string;
  jenis_sarana: string;
  nomor_seri: string;
  lokasi: string;
  titik_lokasi: string;
  spesifikasi: string;
  tanggal_pembelian: DateTime;
  tanggal_kadaluwarsa: DateTime;
  berat: number;
  jenis_APAP: string;
  pemasok: string;
  pic: string;
  status: boolean | string;
  uploadedBy?: string;
  deskripsi?: string;
  kesiapan?: string;
  gambar?: string;
}

export interface TableProps {
  tableContent: TableItem[];
}

export interface ApiItem {
  id_item: number;
  nama_item: string;
  jenis_sarana: string;
  nomor_ser: string;
  nama_lokasi: string;
  titik_lokasi: string;
  spesifikasi: string;
  tanggal_pembelian: string;
  tanggal_kadaluwarsa?: DateTime;
  berat?: number;
  jenis_APAP?: string;
  pemasok: string;
  PIC: string;
  status_pemasangan: boolean;
  deskripsi: string;
  gambar?: string;
}

export type InspeksiRecord = {
  [key: string]: string | number | boolean | null;
};

export type InspeksiData = {
  [tableName: string]: InspeksiRecord[];
};

export interface BarchartProps {
  location?: string;
  bulan: number;
  tahun: number;
  mode?: "lokasi" | "jenis";
}

export interface RekapLocation {
  lokasi: string;
  siap_items: number;
  minor_items: number;
  mayor_items: number;
  belum_items: number;
}

export interface RekapJenis {
  jenis_sarana: string;
  siap: number;
  minor: number;
  mayor: number;
  belum: number;
}

export interface FormData {
  itemName: string;
  serialNumber: string;
  locationPoint: string;
  locationId: string;
  specification: string;
  installationDate: string;
  supplier: string;
  pic: string;
  installationStatus: string;
  file: File | null;

  // 🔹 Tambahan untuk APAP
  expiryDate?: string;
  weight?: string;
  purchaseDate?: string;
  apapType?: "GAS_CAIR_NON_HALON" | "POWDER" | "CO2" | "LITHIUM";
}

export interface InputFieldProps {
  name: keyof FormData;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

export interface QRCodeProps {
  id: number;
}

export interface BarchartProps {
  jenis: string; 
  bulan: number;
  tahun: number;
}

export type InspectionResponse = {
  item: {
    jenis_sarana: string;
    nama_item: string;
  };
  inspeksiTable: string;
  columns: { column_name: string; data_type: string | boolean }[];
};

export interface RadioOptionProps {
  name: keyof FormData;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export interface TelegramResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  type: string;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export interface TelegramGetUpdatesResponse {
  ok: boolean;
  result: TelegramUpdate[];
  description?: string;
}

export interface AddElementProps {
  onClick: () => void;
}

export interface Item {
  id: string;
  nama_item: string;
  nomor_seri: string;
}

export type PaginationReturn = {
  currentData: TableItem[];
  currentPage: number;
  totalPages: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export type Params = {
  id_item: string;
}

export interface SearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type TitikLokasi = {
  id_titik_lokasi: number;
  nama_titik_lokasi: string;
  lokasi_id: number;
};

export type Lokasi = {
  lokasi_id: number;
  nama_lokasi: string;
  titik_lokasi: TitikLokasi[];
};

export type Inspeksi = Record<string, unknown>;

export type ItemForCheck = {
  inspeksi_sprinkler: Inspeksi[];
  inspeksi_APAP: Inspeksi[];
  inspeksi_detector: Inspeksi[];
  inspeksi_hidran_bangunan: Inspeksi[];
  inspeksi_hidran_halaman: Inspeksi[];
  inspeksi_kotak_p3k: Inspeksi[];
  inspeksi_ruang_mns: Inspeksi[];
  inspeksi_rumah_pompa_hidran: Inspeksi[];
  inspeksi_sarana_jalan_keluar: Inspeksi[];
  inspeksi_scba: Inspeksi[];
  inspeksi_spill_containment_room: Inspeksi[];
  inspeksi_fire_ball: Inspeksi[];
  inspeksi_cctv: Inspeksi[];
  jenis_sarana?: string | null;
};

export type StatusKategori =
  | "Siap 100%"
  | "Minor Ketidaksesuaian"
  | "Mayor Ketidaksiapan"
  | "Belum diperiksa / Rusak / Tidak Siap";
  
export type RekapitulasiResponse = {
  overall?: {
    persentase_siap?: string | number;
  };
  per_lokasi?: LokasiData[];
  per_jenis?: JenisData[];
};

export type LokasiData = {
  lokasi: string;
  persentase_siap?: string | number;
};

export type JenisData = {
  jenis_sarana: string;
  persentase_siap?: string | number;
};

export type ItemStatus = {
  id_item: number;
  status: string;
};

export type MainLokasi = {
  id?: string;
  lokasi_id?: string;
  nama_lokasi: string;
  titik_lokasi?: TitikLokasi[]
};

export type LokasiAPI = {
  lokasi_id: string | number;
  nama_lokasi: string;
};

export function formatColumnName(name: string): string {
  const withSpaces = name.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export function formatJenisSarana(name?: string): string {
  if (!name) return "";

  // Hilangkan prefix "inspeksi_"
  const cleaned = name.replace(/^inspeksi_/, "");

  // Pisahkan underscore jadi kata
  return cleaned
    .split("_")
    .map(
      word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

export const jenisSarana = [
  {nama: "APAP", value: "APAP" }, 
  {nama: "SCBA", value: "scba" }, 
  {nama: "Sprinkler", value: "sprinkler" }, 
  {nama: "Detektor", value: "detector" }, 
  {nama: "Hidran Bangunan", value: "hidran_bangunan" }, 
  {nama: "Hidran Halaman", value: "hidran_halaman" }, 
  {nama: "Rumah Pompa Hidran", value: "rumah_pompa_hidran" }, 
  {nama: "Sarana Jalan Keluar", value: "sarana_jalan_keluar" }, 
  {nama: "Kotak P3K", value: "kotak_p3k" }, 
  {nama: "Spill Containment Room", value: "spill_containment_room" }, 
  {nama: "Ruang MNS", value: "ruang_mns" }, 
  {nama: "Fire Ball", value: "fire_ball" }, 
  {nama: "CCTV", value: "cctv" }
]
