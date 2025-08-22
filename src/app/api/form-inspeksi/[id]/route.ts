import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import supabase from "@/lib/supabase";

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
  cctv: "inspeksi_cctv",
  fireball: "inspeksi_fire_ball",
};

// ====================== GET ======================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "ID item tidak valid" }, { status: 400 });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id_item: Number(id) },
      select: { jenis_sarana: true, nama_item: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
    }

    const normalizeKey = (str: string) =>
      str.toLowerCase().replace(/\s+/g, "_");

    const inspeksiTable = tableMap[normalizeKey(item.jenis_sarana!)];

    if (!inspeksiTable) {
      return NextResponse.json(
        { error: `Tidak ada tabel inspeksi untuk jenis_sarana ${item.jenis_sarana}` },
        { status: 400 }
      );
    }

    const columns: { column_name: string; data_type: string }[] =
      await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '${inspeksiTable}'
          AND table_schema = 'public'
        ORDER BY ordinal_position
      `);

    return NextResponse.json({ item, inspeksiTable, columns });
  } catch (error) {
    console.error("Error fetching inspeksi info:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// ====================== POST ======================
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string | null;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "ID item tidak valid" }, { status: 400 });
    }

    const item = await prisma.item.findUnique({
      where: { id_item: Number(id) },
      select: { jenis_sarana: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
    }

    const inspeksiTable = tableMap[item.jenis_sarana!.toLowerCase().replace(/\s+/g, "_")];
    if (!inspeksiTable) {
      return NextResponse.json(
        { error: `Tidak ada tabel inspeksi untuk jenis_sarana ${item.jenis_sarana}` },
        { status: 400 }
      );
    }

    // 🔹 Upload file gambar (jika ada)
    let imageUrl: string | null = null;
    const file = formData.get("gambar") as File | null;

    if (file) {
      const bucket = "images";
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `inspeksi/${fileName}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    // 🔹 Convert formData → object
    const body: Record<string, string | number | null> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        body[key] = value;
      }
    });

    if (imageUrl) {
      body.gambar = imageUrl;
    }

    // 🔹 Build dynamic query
    const cols = Object.keys(body).join(", ");
    const vals = Object.values(body)
      .map((v) => (v === null ? "NULL" : typeof v === "string" ? `'${v}'` : v))
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
