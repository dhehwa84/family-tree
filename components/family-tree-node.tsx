"use client"

import { Handle, Position } from "reactflow"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { FamilyMember } from "@/lib/database"

interface FamilyTreeNodeProps {
  data: FamilyMember & {
    onEdit: (member: FamilyMember) => void
    onDelete: (id: number) => void
  }
}

export function FamilyTreeNode({ data }: FamilyTreeNodeProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const getAge = () => {
    if (!data.date_of_birth) return ""
    const birth = new Date(data.date_of_birth)
    const end = data.date_of_death ? new Date(data.date_of_death) : new Date()
    const age = end.getFullYear() - birth.getFullYear()
    return data.date_of_death ? `(${age})` : `Age ${age}`
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Card className="w-64 shadow-lg">
        <CardContent className="p-4">
          {data.picture_url && (
            <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
              <img
                src={data.picture_url || "/placeholder.svg"}
                alt={`${data.name} ${data.surname}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-center">
            <h3 className="font-bold text-lg">
              {data.name} {data.surname}
            </h3>

            {data.totem && (
              <Badge variant="secondary" className="mt-1">
                {data.totem}
              </Badge>
            )}

            <div className="text-sm text-gray-600 mt-2">
              {data.date_of_birth && <div>Born: {formatDate(data.date_of_birth)}</div>}
              {data.date_of_death && <div>Died: {formatDate(data.date_of_death)}</div>}
              <div className="font-medium">{getAge()}</div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => data.onEdit(data)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => data.onDelete(data.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}
