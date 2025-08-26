import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {Inspeksi, ItemForCheck, StatusKategori} from "@/types/utils"

// ---- Helper: tentukan status dari daftar inspeksi terakhir item ----
// Catatan: di query kita sudah `take: 1` per relation (latest).
const checkStatus = (item: ItemForCheck): StatusKategori => {
  const inspeksiList: Inspeksi[] = [
    ...item.inspeksi_sprinkler,
    ...item.inspeksi_APAP,
    ...item.inspeksi_detector,
    ...item.inspeksi_hidran_bangunan,
    ...item.inspeksi_hidran_halaman,
    ...item.inspeksi_kotak_p3k,
    ...item.inspeksi_ruang_mns,
    ...item.inspeksi_rumah_pompa_hidran,
    ...item.inspeksi_sarana_jalan_keluar,
    ...item.inspeksi_scba,
    ...item.inspeksi_spill_containment_room,
    ...item.inspeksi_fire_ball,
    ...item.inspeksi_cctv,
  ];

  if (inspeksiList.length === 0) {
    return "Belum diperiksa / Rusak / Tidak Siap";
  }

  // Karena per item seharusnya hanya relevan satu jenis inspeksi
  // (dan query sudah ambil latest per jenis), cukup nilai dari entry yang ada.
  for (const inspeksi of inspeksiList) {
    const values = Object.values(inspeksi);
    const falseCount = values.filter((v) => v === false).length;

    if (falseCount === 0) return "Siap 100%";
    if (falseCount === 1) return "Minor Ketidaksesuaian";
    if (falseCount > 1) return "Mayor Ketidaksiapan";
  }

  return "Belum diperiksa / Rusak / Tidak Siap";
};

// ---- Helper: tentukan label jenis sarana untuk pengelompokan ----
const getJenisSarana = (item: ItemForCheck): string => {
  const byField = item.jenis_sarana?.trim();
  if (byField) return byField;

  // Fallback: tebak dari relation inspeksi mana yang punya data
  const candidates: Array<{ present: boolean; label: string }> = [
    { present: item.inspeksi_APAP.length > 0, label: "APAP" },
    { present: item.inspeksi_sprinkler.length > 0, label: "Sprinkler" },
    { present: item.inspeksi_detector.length > 0, label: "Detector" },
    { present: item.inspeksi_hidran_bangunan.length > 0, label: "Hidran Bangunan" },
    { present: item.inspeksi_hidran_halaman.length > 0, label: "Hidran Halaman" },
    { present: item.inspeksi_kotak_p3k.length > 0, label: "Kotak P3K" },
    { present: item.inspeksi_ruang_mns.length > 0, label: "Ruang MNS" },
    { present: item.inspeksi_rumah_pompa_hidran.length > 0, label: "Rumah Pompa Hidran" },
    { present: item.inspeksi_sarana_jalan_keluar.length > 0, label: "Sarana Jalan Keluar" },
    { present: item.inspeksi_scba.length > 0, label: "SCBA" },
    { present: item.inspeksi_spill_containment_room.length > 0, label: "Spill Containment Room" },
    { present: item.inspeksi_fire_ball.length > 0, label: "Fire Ball" },
    { present: item.inspeksi_cctv.length > 0, label: "CCTV" },
  ];

  const found = candidates.find((c) => c.present);
  return found?.label ?? "UNKNOWN";
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bulan = parseInt(searchParams.get("bulan") || "");
  const tahun = parseInt(searchParams.get("tahun") || "");

  if (!bulan || !tahun) {
    return NextResponse.json(
      { error: "Bulan dan tahun wajib diisi" },
      { status: 400 }
    );
  }

  const awalBulan = new Date(tahun, bulan - 1, 1);
  const akhirBulan = new Date(tahun, bulan, 0, 23, 59, 59);

  try {
    const lokasiData = await prisma.lokasi.findMany({
      include: {
        item: {
          where: { status_pemasangan: true, status: "APPROVED" },
          include: {
            inspeksi_sprinkler: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_APAP: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_detector: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_hidran_bangunan: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_hidran_halaman: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_kotak_p3k: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_ruang_mns: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_rumah_pompa_hidran: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_sarana_jalan_keluar: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_scba: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_spill_containment_room: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_fire_ball: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
            inspeksi_cctv: { where: { createdAt: { gte: awalBulan, lte: akhirBulan } }, orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
    });

    // ---------- Rekap Per Lokasi ----------
    const rekapPerLokasi = lokasiData.map((lokasi) => {
      const totalItems = lokasi.item.length;
      let siapCount = 0;
      let minorCount = 0;
      let mayorCount = 0;
      let belumCount = 0;

      const itemDetails = lokasi.item.map((item) => {
        const status = checkStatus(item);
        if (status === "Siap 100%") siapCount++;
        if (status === "Minor Ketidaksesuaian") minorCount++;
        if (status === "Mayor Ketidaksiapan") mayorCount++;
        if (status === "Belum diperiksa / Rusak / Tidak Siap") belumCount++;

        return {
          id_item: item.id_item,                 // biarkan number (sesuai model)
          nama_item: item.nama_item ?? "Unknown",
          jenis_sarana: getJenisSarana(item),
          status,
        };
      });

      const persentaseSiap = totalItems > 0 ? (siapCount / totalItems) * 100 : 0;

      return {
        lokasi: lokasi.nama_lokasi,
        total_items: totalItems,
        siap_items: siapCount,
        minor_items: minorCount,
        mayor_items: mayorCount,
        belum_items: belumCount,
        persentase_siap: persentaseSiap.toFixed(2),
        item_details: itemDetails,
      };
    });

    // ---------- Rekap Per Jenis Sarana ----------
    const jenisRekap: Record<
      string,
      { siap: number; minor: number; mayor: number; belum: number; total: number }
    > = {};

    lokasiData.forEach((lokasi) => {
      lokasi.item.forEach((item) => {
        const status = checkStatus(item);
        const key = getJenisSarana(item); // << kunci per jenis_sarana

        if (!jenisRekap[key]) {
          jenisRekap[key] = { siap: 0, minor: 0, mayor: 0, belum: 0, total: 0 };
        }

        jenisRekap[key].total++;
        if (status === "Siap 100%") jenisRekap[key].siap++;
        if (status === "Minor Ketidaksesuaian") jenisRekap[key].minor++;
        if (status === "Mayor Ketidaksiapan") jenisRekap[key].mayor++;
        if (status === "Belum diperiksa / Rusak / Tidak Siap") jenisRekap[key].belum++;
      });
    });

    const rekapPerJenis = Object.entries(jenisRekap).map(([jenis_sarana, data]) => ({
      jenis_sarana,
      ...data,
      persentase_siap: data.total > 0 ? ((data.siap / data.total) * 100).toFixed(2) : "0.00",
    }));

    // ---------- Rekap Overall ----------
    let totalItems = 0;
    let totalSiap = 0;
    let totalMinor = 0;
    let totalMayor = 0;
    let totalBelum = 0;

    rekapPerJenis.forEach((j) => {
      totalItems += j.total;
      totalSiap += j.siap;
      totalMinor += j.minor;
      totalMayor += j.mayor;
      totalBelum += j.belum;
    });

    const rekapOverall = {
      total_items: totalItems,
      siap_items: totalSiap,
      minor_items: totalMinor,
      mayor_items: totalMayor,
      belum_items: totalBelum,
      persentase_siap: totalItems > 0 ? ((totalSiap / totalItems) * 100).toFixed(2) : "0.00",
    };

    return NextResponse.json({
      per_lokasi: rekapPerLokasi,
      per_jenis: rekapPerJenis,   // <-- ini sekarang benar-benar per jenis_sarana
      overall: rekapOverall,
    });
  } catch (error) {
    console.error("Error fetching rekapitulasi:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
