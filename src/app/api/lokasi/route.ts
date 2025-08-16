import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// CREATE lokasi
export async function POST(req: NextRequest) {
  try {
    const { nama_lokasi } = await req.json();

    if (!nama_lokasi) {
      return NextResponse.json(
        { error: "Nama lokasi wajib diisi" },
        { status: 400 }
      );
    }

    const newLokasi = await prisma.lokasi.create({
      data: { nama_lokasi },
    });

    return NextResponse.json(newLokasi, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan lokasi" },
      { status: 500 }
    );
  }
}

// DELETE lokasi
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const deletedLokasi = await prisma.lokasi.delete({
      where: {
        lokasi_id: Number(id), // pastikan field ini benar di schema.prisma
      },
    });

    return NextResponse.json(deletedLokasi, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus lokasi" },
      { status: 500 }
    );
  }
}
