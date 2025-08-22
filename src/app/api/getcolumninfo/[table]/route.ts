import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db"; // Assuming prisma is exported from this path

export async function GET(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  const { table } = await params;

  if (!table) {
    return NextResponse.json(
      { error: "Nama tabel harus disediakan" },
      { status: 400 }
    );
  }

  try {
    const result: { column_name: string; data_type: string }[] =
      await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '${table}'
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `);

    // 👉 Bedakan antara "tabel tidak ada" vs "tabel ada tapi kosong"
    if (!result || result.length === 0) {
      return NextResponse.json(
        { message: `Tabel "${table}" tidak ditemukan di schema public` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      table,
      columns: result,
    });
  } catch (error) {
    console.error("Error fetching column info:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
