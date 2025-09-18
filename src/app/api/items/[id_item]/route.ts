import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id_item: string }> }
) {
  try {
    const id = parseInt((await params).id_item);

    await prisma.item.delete({
      where: { id_item: id }, // or { id: id } if your PK is "id"
    });

    return NextResponse.json({ message: "Item Berhasil Dihapus" }, { status: 200 });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_item: string }> }
) {
  const id = parseInt((await params).id_item);

  try {
    const item = await prisma.item.findUnique({
      where: { id_item: id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id_item: string }> }
) {
  const id = parseInt((await params).id_item);

  try {
    const body = await req.json();

    // PATCH: hanya update field yang dikirim
    const updatedItem = await prisma.item.update({
      where: { id_item: id },
      data: body,  // hanya field yg ada di body yg akan diubah
    });

    return NextResponse.json(
      { message: "Item updated (PATCH)", data: updatedItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
