import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id_item: string }> }) {
  const { id_item } = (await params);
  const { newStatus } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id_item: parseInt(id_item) },
      data: { status: newStatus },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("Error updating item status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}