import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import supabase from "@/lib/supabase";
import { JenisAPAP, ItemStatus } from "@prisma/client"

export async function DELETE(
  req: Request,
  { params }: { params: { id_item: string } }
) {
  try {
    const id = parseInt(params.id_item);

    await prisma.item.delete({
      where: { id_item: id }, // or { id: id } if your PK is "id"
    });

    return NextResponse.json({ message: "Item Berhasil Dihapus" }, { status: 200 });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}