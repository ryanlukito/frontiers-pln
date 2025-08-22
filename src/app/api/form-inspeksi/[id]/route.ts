import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const tableMap: Record<string, string> = {
    sprinkler: "inspeksi_sprinkler",
    APAP: "inspeksi_APAP",
    detector: "inspeksi_detector",
    hidran_bangunan: "inspeksi_hidran_bangunan",
    hidran_halaman: "inspeksi_hidran_halaman",
    kotak_p3k: "inspeksi_kotak_p3k",
    ruang_mns: "inspeksi_ruang_mns",
    rumah_pompa_hidran: "inspeksi_rumah_pompa_hidran",
    sarana_jalan_keluar: "inspeksi_sarana_jalan_keluar",
    scba: "inspeksi_scba",
    spill_containment_room: "inspeksi_spill_containment_room",
    cctv : "inspeksi_cctv",
    fireball : "inspeksi_fire_ball",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "ID item tidak valid" }, { status: 400 });
  }

  try {
    // 1. Ambil item (jenis_sarana + nama_item)
    const item = await prisma.item.findUnique({
      where: { id_item: Number(id) },
      select: { jenis_sarana: true, nama_item: true },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Map jenis_sarana → nama tabel inspeksi
    // helper untuk normalisasi
    const normalizeKey = (str: string) =>
    str.toLowerCase().replace(/\s+/g, "_"); // lowercase & ganti spasi jadi underscore

// ...
    const inspeksiTable = tableMap[normalizeKey(item.jenis_sarana!)];


    // const inspeksiTable = tableMap[item.jenis_sarana as string];

    if (!inspeksiTable) {
      return NextResponse.json(
        { error: `Tidak ada tabel inspeksi untuk jenis_sarana ${item.jenis_sarana}` },
        { status: 400 }
      );
    }

    // 3. Ambil daftar kolom dari tabel inspeksi yang sesuai
    const columns: { column_name: string; data_type: string }[] =
      await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '${inspeksiTable}'
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `);

    console.log("Columns for inspeksi table:", columns);

    return NextResponse.json({
      item,
      inspeksiTable,
      columns,
    });
  } catch (error) {
    console.error("Error fetching inspeksi info:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, formData } = await req.json();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID item tidak valid" }, { status: 400 });
    }

    // Ambil jenis sarana
    const item = await prisma.item.findUnique({
      where: { id_item: Number(id) },
      select: { jenis_sarana: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
    }

    const inspeksiTable = tableMap[item.jenis_sarana as string];
    if (!inspeksiTable) {
      return NextResponse.json(
        { error: `Tidak ada tabel inspeksi untuk jenis_sarana "${item.jenis_sarana}"` },
        { status: 400 }
      );
    }

    // Insert formData (termasuk foto URL)
    const cols = Object.keys(formData).join(", ");
    const vals = Object.values(formData)
      .map((v) => (typeof v === "string" ? `'${v}'` : v))
      .join(", ");

    const query = `
      INSERT INTO ${inspeksiTable} (id_item, ${cols})
      VALUES (${Number(id)}, ${vals})
      RETURNING *;
    `;

    const result = await prisma.$queryRawUnsafe(query);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error inserting inspeksi data:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

