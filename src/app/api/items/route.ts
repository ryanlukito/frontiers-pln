import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        nama_lokasi : {select : {nama_lokasi: true}},
        lokasi_titik_lokasi : {select : {nama_titik_lokasi : true}},
      },
      where : {
        is_deleted : false,
        status : "APPROVED",
      },
      orderBy: { id_item: "asc" },
    });

    // console.log("Items dari FindMany : ", items)

    const result = items.map((item) => ({
      id_item : item.id_item,
      nama_item : item.nama_item,
      nomor_ser : item.nomor_ser,
      nama_lokasi : item.nama_lokasi.nama_lokasi,
      titik_lokasi : item.lokasi_titik_lokasi.nama_titik_lokasi,
      deskripsi : item.deskripsi,
      jenis_sarana : item.jenis_sarana,
      spesifikasi : item.spesifikasi,
      tanggal_pembelian : item.tanggal_pembelian,
      pemasok : item.pemasok,
      gambar : item.gambar,
      PIC : item.PIC,
      status_pemasangan : item.status_pemasangan,
      uploadedBy : item.uploadedBy
    }))

    return NextResponse.json({ success: true, items : result});
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
