import { NextRequest, NextResponse } from "next/server";
import db, { relationshipQueries, familyMemberQueries } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const relationships = relationshipQueries.getAll.all();
    return NextResponse.json(relationships);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch relationships" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.parent_id || !body.child_id) {
      return NextResponse.json(
        { error: "Both parent_id and child_id are required" },
        { status: 400 }
      );
    }

    const parentId = Number(body.parent_id);
    const childId = Number(body.child_id);

    // Validate numbers
    if (isNaN(parentId) || isNaN(childId)) {
      return NextResponse.json(
        { error: "IDs must be valid numbers" },
        { status: 400 }
      );
    }

    // Check if members exist
    const parentExists = familyMemberQueries.getById.get(parentId);
    const childExists = familyMemberQueries.getById.get(childId);
    
    if (!parentExists || !childExists) {
      return NextResponse.json(
        { error: "One or both members don't exist" },
        { status: 404 }
      );
    }

    // Create relationship
    const result = relationshipQueries.create.run(
      parentId,
      childId,
      body.relationship_type || "parent-child"
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      parent_id: parentId,
      child_id: childId,
      relationship_type: body.relationship_type || "parent-child"
    }, { status: 201 });

  } catch (error) {
    console.error("Relationship creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create relationship" },
      { status: 500 }
    );
  }
}

// Add this to handle OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}