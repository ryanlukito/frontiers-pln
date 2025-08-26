import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Inspeksi, ItemForCheck, StatusKategori } from "@/types/utils";

// --- Helper cek status item ---
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

  for (const inspeksi of inspeksiList) {
    const values = Object.values(inspeksi);
    const falseCount = values.filter((v) => v === false).length;

    if (falseCount === 0) return "Siap 100%";
    if (falseCount === 1) return "Minor Ketidaksesuaian";
    if (falseCount > 1) return "Mayor Ketidaksiapan";
  }

  return "Belum diperiksa / Rusak / Tidak Siap";
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Ambil bulan & tahun dari query, kalau kosong pakai sekarang
  const now = new Date();
  const bulan = parseInt(searchParams.get("bulan") || (now.getMonth() + 1).toString()); // getMonth() mulai dari 0
  const tahun = parseInt(searchParams.get("tahun") || now.getFullYear().toString());

  const awalBulan = new Date(tahun, bulan - 1, 1);
  const akhirBulan = new Date(tahun, bulan, 0, 23, 59, 59);

  try {
    const items = await prisma.item.findMany({
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
    });

    const hasil = items.map((item) => ({
      id_item: item.id_item,
      nama_item: item.nama_item,
      status: checkStatus(item),
    }));

    return NextResponse.json({ bulan, tahun, data: hasil });
  } catch (error) {
    console.error("Error fetching kesiapan item:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
