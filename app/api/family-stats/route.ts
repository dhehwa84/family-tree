import { NextResponse } from "next/server"
import { familyMemberQueries, relationshipQueries } from "@/lib/database"

export async function GET() {
  try {
    const members = familyMemberQueries.getAll.all() as any[]
    const relationships = relationshipQueries.getAll.all() as any[]

    // Calculate generations (simplified - count levels from root)
    const parentIds = new Set(relationships.map((r) => r.parent_id))
    const childIds = new Set(relationships.map((r) => r.child_id))
    const rootMembers = members.filter((m) => !childIds.has(m.id))
    const generations = rootMembers.length > 0 ? calculateMaxDepth(members, relationships) : 1

    // Get family name from most common surname
    const surnameCount = members.reduce(
      (acc, member) => {
        acc[member.surname] = (acc[member.surname] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const familyName = Object.keys(surnameCount).reduce((a, b) => (surnameCount[a] > surnameCount[b] ? a : b), "")

    return NextResponse.json({
      totalMembers: members.length,
      generations,
      familyName,
      location: "Zimbabwe", // You can make this dynamic later
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch family stats" }, { status: 500 })
  }
}

function calculateMaxDepth(members: any[], relationships: any[]): number {
  const childToParents = new Map()
  relationships.forEach((rel) => {
    if (!childToParents.has(rel.child_id)) {
      childToParents.set(rel.child_id, [])
    }
    childToParents.get(rel.child_id).push(rel.parent_id)
  })

  let maxDepth = 1
  members.forEach((member) => {
    const depth = getDepth(member.id, childToParents, new Set())
    maxDepth = Math.max(maxDepth, depth)
  })

  return maxDepth
}

function getDepth(memberId: number, childToParents: Map<number, number[]>, visited: Set<number>): number {
  if (visited.has(memberId)) return 0
  visited.add(memberId)

  const parents = childToParents.get(memberId) || []
  if (parents.length === 0) return 1

  return 1 + Math.max(...parents.map((parentId) => getDepth(parentId, childToParents, new Set(visited))))
}
