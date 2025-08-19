import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import supabase from "@/lib/supabase";
import { JenisAPAP, ItemStatus } from "@prisma/client"

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 🔹 convert FormData -> object text
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") {
        body[key] = value;
      }
    });

    console.log("📥 Received Data:", body);

    if (!body.nama_item || !body.nomor_ser || !body.lokasi_id || !body.id_titik_lokasi) {
      return NextResponse.json({ error: "Field tidak boleh kosong" }, { status: 400 });
    }

    let lokasiId: number | string = body.lokasi_id;
    let titikLokasiId: number | string = body.id_titik_lokasi;

    // 🔹 Lokasi baru
    if (body.lokasi_id === "new" && body.new_lokasi_name) {
      const existingLokasi = await prisma.lokasi.findFirst({
        where: { nama_lokasi: { equals: body.new_lokasi_name.trim(), mode: "insensitive" } },
      });

      lokasiId = existingLokasi
        ? existingLokasi.lokasi_id
        : (await prisma.lokasi.create({ data: { nama_lokasi: body.new_lokasi_name.trim() } }))
            .lokasi_id;
    }

    // 🔹 Titik lokasi baru
    if (body.id_titik_lokasi === "new" && body.new_titik_lokasi_name) {
      const existingTitikLokasi = await prisma.titik_lokasi.findFirst({
        where: {
          nama_titik_lokasi: { equals: body.new_titik_lokasi_name.trim(), mode: "insensitive" },
          lokasi_id: Number(lokasiId),
        },
      });

      titikLokasiId = existingTitikLokasi
        ? existingTitikLokasi.id_titik_lokasi
        : (
            await prisma.titik_lokasi.create({
              data: {
                nama_titik_lokasi: body.new_titik_lokasi_name.trim(),
                lokasi_id: Number(lokasiId),
              },
            })
          ).id_titik_lokasi;
    }

    // 🔹 Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "User is Not Logged In!" }, { status: 401 });
    }

    const uploadedBy = session.user.email;

    // 🔹 Upload file gambar ke Supabase Storage
    let imageUrl: string | null = null;
    const file = formData.get("gambar") as File | null;

    if (file) {
      const bucket = "images";
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `item-image/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Upload error:", uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    // 🔹 Insert item pakai Prisma
    const newItem = await prisma.item.create({
      data: {
        nama_item: body.nama_item,
        jenis_sarana: body.jenis_sarana,
        nomor_ser: body.nomor_ser,
        deskripsi: body.deskripsi,
        lokasi_id: Number(lokasiId),
        id_titik_lokasi: Number(titikLokasiId),
        spesifikasi: body.spesifikasi || "",
        tanggal_pembelian: body.tanggal_pembelian ? new Date(body.tanggal_pembelian) : null,
        tanggal_kadaluwarsa: body.tanggal_kadaluwarsa ? new Date(body.tanggal_kadaluwarsa) : null,
        berat: body.berat ? parseFloat(body.berat) : null,
        jenis_APAP: body.jenis_APAP ? (body.jenis_APAP as JenisAPAP) : null, // ✅ cast enum
        pemasok: body.pemasok,
        PIC: body.PIC,
        gambar: imageUrl,
        status: (body.status as ItemStatus) || ItemStatus.PENDING, // ✅ cast enum
        status_pemasangan: body.status_pemasangan === "Terpasang",
        uploadedBy: uploadedBy || "Unknown User",
      },
    });

    console.log("🗄️ Database Response:", newItem);

    return NextResponse.json({ message: "Item berhasil disimpan!", data: newItem }, { status: 201 });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


