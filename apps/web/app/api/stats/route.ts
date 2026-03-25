import { NextResponse } from "next/server";

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const res = await fetch(`${baseUrl}/stats`);
  const data = await res.json();
  return NextResponse.json(data);
}
