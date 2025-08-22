import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id_item: string } }
) {
  const { id_item } = await context.params;

  if (isNaN(Number(id_item))) {
    return NextResponse.json({ error: "ID item tidak valid" }, { status: 400 });
  }

  try {
    const inspeksiTables = {
      inspeksi_sprinkler: await prisma.inspeksi_sprinkler.findMany({
        where: { id_item: Number(id_item) }, // Convert to Number
      }),
      inspeksi_APAP: await prisma.inspeksi_APAP.findMany({
        where: { id_item: Number(id_item) },
      }),
      inspeksi_detector: await prisma.inspeksi_detector.findMany({
        where: { id_item: Number(id_item) },
      }),
      inspeksi_hidran_bangunan: await prisma.inspeksi_hidran_bangunan.findMany({
        where: { id_item: Number(id_item) },
      }),
      inspeksi_hidran_halaman: await prisma.inspeksi_hidran_halaman.findMany({
        where: { id_item: Number(id_item) },
      }),
      inspeksi_kotak_p3k: await prisma.inspeksi_kotak_p3k.findMany({
        where: { id_item: Number(id_item) },
      }),
      inspeksi_ruang_mns: await prisma.inspeksi_ruang_mns.findMany({
        where: { id_item: Number(id_item) },
      }),
      inspeksi_rumah_pompa_hidran:
        await prisma.inspeksi_rumah_pompa_hidran.findMany({
          where: { id_item: Number(id_item) },
        }),
      inspeksi_sarana_jalan_keluar:
        await prisma.inspeksi_sarana_jalan_keluar.findMany({
          where: { id_item: Number(id_item) },
        }),
      inspeksi_scba: await prisma.inspeksi_scba.findMany({
        where: { id_item: Number(id_item) },
      }),
      inspeksi_spill_containment_room:
        await prisma.inspeksi_spill_containment_room.findMany({
          where: { id_item: Number(id_item) },
        }),
    };

    // Hanya menyertakan tabel yang memiliki data
    const filteredResponse = Object.fromEntries(
      Object.entries(inspeksiTables).filter(([, value]) => value.length > 0)
    );

    console.log('Filtered Response : ', filteredResponse)

    if (Object.keys(filteredResponse).length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data inspeksi untuk id_item ini" },
        { status: 404 }
      );
    }

    return NextResponse.json(filteredResponse);
  } catch (error) {
    console.error("Error fetching inspeksi data:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
