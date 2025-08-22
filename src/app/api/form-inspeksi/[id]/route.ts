import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: "ID item tidak valid" }, { status: 400 });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id_item: Number(id) },
      select: {
        jenis_sarana: true,
        nama_item: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
