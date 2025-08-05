"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import ReactFlow, {
  type Node,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  Controls,
  Background,
  MiniMap,
} from "reactflow"
import "reactflow/dist/style.css"

import { FamilyTreeNode } from "./family-tree-node"
import { FamilyMemberForm } from "./family-member-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { FamilyMember, FamilyRelationship } from "@/lib/database"

export function FamilyTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null)

  // Memoize nodeTypes to prevent React Flow errors
  const nodeTypes = useMemo(
    () => ({
      familyMember: FamilyTreeNode,
    }),
    [],
  )

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      const [membersRes, relationshipsRes] = await Promise.all([
        fetch("/api/family-members"),
        fetch("/api/relationships"),
      ])

      const members: FamilyMember[] = await membersRes.json()
      const relationships: FamilyRelationship[] = await relationshipsRes.json()

      // Convert members to nodes
      const nodeData = members.map((member) => ({
        id: member.id.toString(),
        type: "familyMember",
        position: { x: member.x_position, y: member.y_position },
        data: {
          ...member,
          onEdit: handleEditMember,
          onDelete: handleDeleteMember,
        },
      }))

      // Convert relationships to edges
      const edgeData = relationships.map((rel) => ({
        id: `rel-${rel.id}`, // unique and safe
        source: rel.parent_id.toString(),
        target: rel.child_id.toString(),
        type: "smoothstep",
      }))


      setNodes(nodeData)
      setEdges(edgeData)
    } catch (error) {
      console.error("Failed to load family tree data:", error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Handle node position updates
  const handleNodeDragStop = useCallback(async (event: any, node: Node) => {
    try {
      await fetch(`/api/family-members/${node.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...node.data,
          x_position: node.position.x,
          y_position: node.position.y,
        }),
      })
    } catch (error) {
      console.error("Failed to update node position:", error)
    }
  }, [])

  // Handle new connections
  const onConnect = useCallback(async (connection: Connection) => {
    if (!connection.source || !connection.target) {
      console.warn("Connection missing source or target");
      return;
    }
  
    try {
      const response = await fetch("/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parent_id: connection.source,
          child_id: connection.target
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
  
      const newRelationship = await response.json();
      
      setEdges(eds => addEdge({
        ...connection,
        id: `edge-${newRelationship.id}`,
        type: "smoothstep"
      }, eds));
  
    } catch (error) {
      console.error("Connection failed:", error);
      alert(`Failed to create relationship: ${error.message}`);
    }
  }, [setEdges]);

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member)
    setShowForm(true)
  }

  const handleDeleteMember = async (id: number) => {
    if (confirm("Are you sure you want to delete this family member?")) {
      try {
        await fetch(`/api/family-members/${id}`, { method: "DELETE" })
        loadData()
      } catch (error) {
        console.error("Failed to delete family member:", error)
      }
    }
  }

  const handleFormSubmit = async (data: Partial<FamilyMember>) => {
    try {
      if (editingMember) {
        await fetch(`/api/family-members/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingMember, ...data }),
        })
      } else {
        await fetch("/api/family-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      }

      setShowForm(false)
      setEditingMember(null)
      loadData()
    } catch (error) {
      console.error("Failed to save family member:", error)
    }
  }

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      {showForm && (
        <div className="absolute top-4 right-4 z-10">
          <FamilyMemberForm
            member={editingMember}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingMember(null)
            }}
          />
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
