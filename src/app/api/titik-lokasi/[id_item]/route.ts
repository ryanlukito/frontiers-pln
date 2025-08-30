import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id_item: string } }
) {
  try {
    const id = parseInt(params.id_item);

    await prisma.titik_lokasi.delete({
      where: { id_titik_lokasi: id },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
