import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { 
      status: "online", 
      timestamp: new Date().toISOString(),
      message: "Lukuu server is awake." 
    },
    { status: 200 }
  );
}
