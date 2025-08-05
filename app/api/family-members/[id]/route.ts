import { type NextRequest, NextResponse } from "next/server"
import { familyMemberQueries } from "@/lib/database"

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    familyMemberQueries.delete.run(Number.parseInt(params.id))
    return NextResponse.json({ message: "Family member deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete family member" }, { status: 500 })
  }
}
