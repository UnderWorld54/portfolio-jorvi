import { NextResponse } from "next/server";
import { getPhotos } from "@/lib/sanity";

export async function GET() {
  try {
    const items = await getPhotos();

    return NextResponse.json(items, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error in /api/photos:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch photos",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
