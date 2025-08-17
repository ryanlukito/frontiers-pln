import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, hashedPassword: hashedPassword, role: role.toUpperCase() || "USER" },
    });

    return NextResponse.json({ message: "User registered successfully!", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Registration Error : ", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
