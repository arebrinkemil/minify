import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ message: "Bye World" }, { status: 200 });
}

export async function POST(request) {
  return NextResponse.json({ message: "Bye World" }, { status: 200 });
}