"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FamilyMember } from "@/lib/database"

interface FamilyMemberFormProps {
  member?: FamilyMember
  onSubmit: (data: Partial<FamilyMember>) => void
  onCancel: () => void
}

export function FamilyMemberForm({ member, onSubmit, onCancel }: FamilyMemberFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    surname: member?.surname || "",
    totem: member?.totem || "",
    date_of_birth: member?.date_of_birth || "",
    date_of_death: member?.date_of_death || "",
    picture_url: member?.picture_url || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{member ? "Edit Family Member" : "Add Family Member"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="surname">Last Name</Label>
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="totem">Totem</Label>
            <Input
              id="totem"
              value={formData.totem}
              onChange={(e) => setFormData({ ...formData, totem: e.target.value })}
              placeholder="e.g., Eagle, Wolf, Bear"
            />
          </div>

          <div>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="date_of_death">Date of Death (if applicable)</Label>
            <Input
              id="date_of_death"
              type="date"
              value={formData.date_of_death}
              onChange={(e) => setFormData({ ...formData, date_of_death: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="picture_url">Picture URL</Label>
            <Input
              id="picture_url"
              type="url"
              value={formData.picture_url}
              onChange={(e) => setFormData({ ...formData, picture_url: e.target.value })}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {member ? "Update" : "Add"} Member
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
