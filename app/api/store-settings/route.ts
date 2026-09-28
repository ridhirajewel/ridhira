import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/graphql";

export const revalidate = 60;

export async function GET() {
  const settings = await getStoreSettings();
  return NextResponse.json(settings);
}