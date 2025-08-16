import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // lebih aman gunakan singleton

// CREATE titik_lokasi
export async function POST(req: NextRequest) {
  try {
    const { lokasi_id, nama_titik_lokasi } = await req.json();

    if (!lokasi_id || !nama_titik_lokasi) {
      return NextResponse.json(
        { error: "lokasi_id dan nama_titik_lokasi wajib diisi" },
        { status: 400 }
      );
    }

    const newTitikLokasi = await prisma.titik_lokasi.create({
      data: {
        lokasi_id: Number(lokasi_id),
        nama_titik_lokasi,
      },
    });

    return NextResponse.json(newTitikLokasi, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data" },
      { status: 500 }
    );
  }
}

// GET semua lokasi
export async function GET() {
  try {
    const lokasi = await prisma.lokasi.findMany({
      select: { lokasi_id: true, nama_lokasi: true },
    });

    return NextResponse.json(lokasi, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}