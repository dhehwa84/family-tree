import { NextRequest, NextResponse } from "next/server";
import { relationshipQueries } from "@/lib/database";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid relationship ID" }, { status: 400 });
  }

  try {
    // Directly attempt to delete
    const result = relationshipQueries.delete.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete relationship:", error);
    return NextResponse.json({ error: "Failed to delete relationship" }, { status: 500 });
  }
}
