import { type NextRequest, NextResponse } from "next/server"
import { familyMemberQueries } from "@/lib/database"

export async function GET() {
  try {
    const members = familyMemberQueries.getAll.all()
    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch family members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, surname, totem, date_of_birth, date_of_death, picture_url, x_position = 0, y_position = 0 } = body

    const result = familyMemberQueries.create.run(
      name,
      surname,
      totem,
      date_of_birth,
      date_of_death,
      picture_url,
      x_position,
      y_position,
    )

    const newMember = familyMemberQueries.getById.get(result.lastInsertRowid)
    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create family member" }, { status: 500 })
  }
}
