import { type NextRequest, NextResponse } from "next/server"
import { familyMemberQueries, relationshipQueries } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const member = familyMemberQueries.getById.get(Number.parseInt(params.id))
    if (!member) {
      return NextResponse.json({ error: "Family member not found" }, { status: 404 })
    }
    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch family member" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, surname, totem, date_of_birth, date_of_death, picture_url, x_position, y_position } = body

    familyMemberQueries.update.run(
      name,
      surname,
      totem,
      date_of_birth,
      date_of_death,
      picture_url,
      x_position,
      y_position,
      Number.parseInt(params.id),
    )

    const updatedMember = familyMemberQueries.getById.get(Number.parseInt(params.id))
    return NextResponse.json(updatedMember)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update family member" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)

    // First delete relationships where this member is a parent or child
    await relationshipQueries.deleteByMember.run(id, id)

    // Then delete the family member
    const result = familyMemberQueries.delete.run(id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Member not found or not deleted" }, { status: 404 })
    }

    return NextResponse.json({ message: "Family member deleted successfully" })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json({ error: "Failed to delete family member" }, { status: 500 })
  }
}


