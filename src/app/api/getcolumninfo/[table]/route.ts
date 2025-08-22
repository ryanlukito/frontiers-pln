import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { table: string } }
) {
  const { table } = params;

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
      `);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { message: "Tabel tidak ditemukan atau tidak memiliki kolom" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching column info:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
