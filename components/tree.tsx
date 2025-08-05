import { useEffect, useState, useRef } from "react"
import Tree from "react-d3-tree"
import type { FamilyMember, FamilyRelationship } from "@/lib/database"

interface HierarchicalNode {
  name: string
  attributes?: Record<string, string>
  children?: HierarchicalNode[]
}

function buildTreeData(
  members: FamilyMember[],
  relationships: FamilyRelationship[],
): HierarchicalNode[] {
  const memberMap = new Map(members.map((m) => [m.id, { ...m, children: [] as FamilyMember[] }]))

  relationships.forEach((rel) => {
    const parent = memberMap.get(rel.parent_id)
    const child = memberMap.get(rel.child_id)
    if (parent && child) {
      parent.children.push(child)
    }
  })

  const roots = members.filter((m) => !relationships.some((r) => r.child_id === m.id))

  const convert = (member: FamilyMember): HierarchicalNode => ({
    name: `${member.name} ${member.surname}`,
    attributes: {
      Birth: member.date_of_birth || "",
      Death: member.date_of_death || "",
      Totem: member.totem || "",
    },
    children: (memberMap.get(member.id)?.children || []).map(convert),
  })

  return roots.map(convert)
}
