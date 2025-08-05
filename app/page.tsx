"use client"

import { FamilyTree } from "@/components/family-tree"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Family Tree - Edit Mode</h1>
            <div className="flex items-center space-x-4">
              <Link href="/family-view">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Mode
                </Button>
              </Link>
              <div className="text-sm text-gray-600">
                Drag nodes to reposition • Connect nodes to create relationships
              </div>
            </div>
          </div>
        </div>
      </header>

      <FamilyTree />
    </div>
  )
}
