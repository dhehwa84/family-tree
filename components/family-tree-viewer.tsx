"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Move, Users, Calendar, MapPin, Edit, Heart, Baby, User } from 'lucide-react'
import Link from "next/link"

interface FamilyMember {
  id: number
  name: string
  surname: string
  totem: string
  date_of_birth: string
  date_of_death: string
  picture_url: string
  x_position: number
  y_position: number
  created_at: string
  updated_at: string
}

interface FamilyRelationship {
  id: number
  parent_id: number
  child_id: number
  relationship_type: string
  created_at: string
}

interface FamilyStats {
  totalMembers: number
  generations: number
  familyName: string
  location: string
}

export function FamilyTreeViewer() {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 })
  const [stats, setStats] = useState<FamilyStats | null>(null)
  const [membersData, setMembersData] = useState<FamilyMember[]>([])
  const [relationshipsData, setRelationshipsData] = useState<FamilyRelationship[]>([])
  
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

const loadData = async () => {
  try {
    // Try to load from APIs first
    const [statsRes, membersRes, relationshipsRes] = await Promise.all([
      fetch("/api/family-stats").catch(() => null),
      fetch("/api/family-members").catch(() => null),
      fetch("/api/relationships").catch(() => null),
    ])

    // Check if all requests were successful and returned JSON
    let statsData, members, relationships

    if (statsRes && statsRes.ok) {
      try {
        statsData = await statsRes.json()
      } catch (e) {
        console.log("Stats API returned non-JSON response, using fallback")
        statsData = null
      }
    }

    if (membersRes && membersRes.ok) {
      try {
        members = await membersRes.json()
      } catch (e) {
        console.log("Members API returned non-JSON response, using fallback")
        members = null
      }
    }

    if (relationshipsRes && relationshipsRes.ok) {
      try {
        relationships = await relationshipsRes.json()
      } catch (e) {
        console.log("Relationships API returned non-JSON response, using fallback")
        relationships = null
      }
    }

    // Use API data if available, otherwise use sample data
    setStats(statsData || {
      totalMembers: 9,
      generations: 3,
      familyName: "Madzvamutse",
      location: "Zimbabwe"
    })

    setMembersData(members || [
      {"id":3,"name":"Pamela","surname":"Bute","totem":"Moyo","date_of_birth":"1996-04-01","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":41.06127434173089,"y_position":-193.66032340657108,"created_at":"2025-08-02 13:34:43","updated_at":"2025-08-05 13:11:47"},
      {"id":6,"name":"Madzvamutse","surname":"Family","totem":"Moyo","date_of_birth":"1800-01-01","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":-203.06174235919036,"y_position":-593.9470629425668,"created_at":"2025-08-02 14:25:12","updated_at":"2025-08-02 14:25:16"},
      {"id":5,"name":"Edita","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"1990-11-13","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":514.8133471787905,"y_position":-289.0017001243309,"created_at":"2025-08-02 14:13:17","updated_at":"2025-08-05 11:18:53"},
      {"id":2,"name":"Ella","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"2025-01-27","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":-655.9102802397995,"y_position":166.6610803847546,"created_at":"2025-08-02 13:33:03","updated_at":"2025-08-05 11:19:52"},
      {"id":1,"name":"Simon","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"1993-12-01","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":-522.7065379430387,"y_position":-243.56511189964448,"created_at":"2025-08-02 13:32:26","updated_at":"2025-08-05 11:19:51"},
      {"id":4,"name":"Simone","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"2021-10-06","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":172.35204539676081,"y_position":193.56460483020834,"created_at":"2025-08-02 13:42:01","updated_at":"2025-08-02 13:42:06"},
      {"id":9,"name":"No Parent","surname":"User","totem":"Moyo","date_of_birth":"2024-02-05","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":1020.1203354325828,"y_position":-663.5068400208565,"created_at":"2025-08-05 13:13:51","updated_at":"2025-08-05 13:13:55"},
      {"id":7,"name":"Basic","surname":"me","totem":"Moyo","date_of_birth":"2025-07-31","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":998,"y_position":-280,"created_at":"2025-08-05 13:11:25","updated_at":"2025-08-05 13:11:44"},
      {"id":8,"name":"dhehwa84@gmail.com","surname":"me","totem":"Moyo","date_of_birth":"2025-06-25","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":651.5054243098848,"y_position":106.29825344003382,"created_at":"2025-08-05 13:12:15","updated_at":"2025-08-05 13:12:33"}
    ])

    setRelationshipsData(relationships || [
      {"id":1,"parent_id":1,"child_id":2,"relationship_type":"parent-child","created_at":"2025-08-02 14:09:39"},
      {"id":2,"parent_id":3,"child_id":4,"relationship_type":"parent-child","created_at":"2025-08-02 14:10:43"},
      {"id":3,"parent_id":1,"child_id":4,"relationship_type":"parent-child","created_at":"2025-08-02 14:10:56"},
      {"id":4,"parent_id":3,"child_id":2,"relationship_type":"parent-child","created_at":"2025-08-02 14:11:05"},
      {"id":5,"parent_id":6,"child_id":1,"relationship_type":"parent-child","created_at":"2025-08-02 14:25:29"},
      {"id":6,"parent_id":6,"child_id":3,"relationship_type":"parent-child","created_at":"2025-08-02 14:25:35"},
      {"id":7,"parent_id":6,"child_id":5,"relationship_type":"parent-child","created_at":"2025-08-02 14:25:47"},
      {"id":8,"parent_id":6,"child_id":7,"relationship_type":"parent-child","created_at":"2025-08-05 13:12:29"},
      {"id":9,"parent_id":5,"child_id":8,"relationship_type":"parent-child","created_at":"2025-08-05 13:12:46"},
      {"id":10,"parent_id":7,"child_id":8,"relationship_type":"parent-child","created_at":"2025-08-05 13:12:52"},
      {"id":11,"parent_id":9,"child_id":7,"relationship_type":"parent-child","created_at":"2025-08-05 13:14:06"}
    ])

    console.log('Using sample data for family tree')
  } catch (error) {
    console.log("API endpoints not available, using sample data:", error)
    // Fallback to sample data
    setStats({
      totalMembers: 9,
      generations: 3,
      familyName: "Madzvamutse",
      location: "Zimbabwe"
    })
    setMembersData([
      {"id":3,"name":"Pamela","surname":"Bute","totem":"Moyo","date_of_birth":"1996-04-01","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":41.06127434173089,"y_position":-193.66032340657108,"created_at":"2025-08-02 13:34:43","updated_at":"2025-08-05 13:11:47"},
      {"id":6,"name":"Madzvamutse","surname":"Family","totem":"Moyo","date_of_birth":"1800-01-01","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":-203.06174235919036,"y_position":-593.9470629425668,"created_at":"2025-08-02 14:25:12","updated_at":"2025-08-02 14:25:16"},
      {"id":5,"name":"Edita","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"1990-11-13","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":514.8133471787905,"y_position":-289.0017001243309,"created_at":"2025-08-02 14:13:17","updated_at":"2025-08-05 11:18:53"},
      {"id":2,"name":"Ella","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"2025-01-27","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":-655.9102802397995,"y_position":166.6610803847546,"created_at":"2025-08-02 13:33:03","updated_at":"2025-08-05 11:19:52"},
      {"id":1,"name":"Simon","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"1993-12-01","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":-522.7065379430387,"y_position":-243.56511189964448,"created_at":"2025-08-02 13:32:26","updated_at":"2025-08-05 11:19:51"},
      {"id":4,"name":"Simone","surname":"Madzvamutse","totem":"Moyo","date_of_birth":"2021-10-06","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":172.35204539676081,"y_position":193.56460483020834,"created_at":"2025-08-02 13:42:01","updated_at":"2025-08-02 13:42:06"},
      {"id":9,"name":"No Parent","surname":"User","totem":"Moyo","date_of_birth":"2024-02-05","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":1020.1203354325828,"y_position":-663.5068400208565,"created_at":"2025-08-05 13:13:51","updated_at":"2025-08-05 13:13:55"},
      {"id":7,"name":"Basic","surname":"me","totem":"Moyo","date_of_birth":"2025-07-31","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":998,"y_position":-280,"created_at":"2025-08-05 13:11:25","updated_at":"2025-08-05 13:11:44"},
      {"id":8,"name":"dhehwa84@gmail.com","surname":"me","totem":"Moyo","date_of_birth":"2025-06-25","date_of_death":"","picture_url":"https://pulse-point.co.za/images/logos/Logo%20Icon%20(1).png","x_position":651.5054243098848,"y_position":106.29825344003382,"created_at":"2025-08-05 13:12:15","updated_at":"2025-08-05 13:12:33"}
    ])
    setRelationshipsData([
      {"id":1,"parent_id":1,"child_id":2,"relationship_type":"parent-child","created_at":"2025-08-02 14:09:39"},
      {"id":2,"parent_id":3,"child_id":4,"relationship_type":"parent-child","created_at":"2025-08-02 14:10:43"},
      {"id":3,"parent_id":1,"child_id":4,"relationship_type":"parent-child","created_at":"2025-08-02 14:10:56"},
      {"id":4,"parent_id":3,"child_id":2,"relationship_type":"parent-child","created_at":"2025-08-02 14:11:05"},
      {"id":5,"parent_id":6,"child_id":1,"relationship_type":"parent-child","created_at":"2025-08-02 14:25:29"},
      {"id":6,"parent_id":6,"child_id":3,"relationship_type":"parent-child","created_at":"2025-08-02 14:25:35"},
      {"id":7,"parent_id":6,"child_id":5,"relationship_type":"parent-child","created_at":"2025-08-02 14:25:47"},
      {"id":8,"parent_id":6,"child_id":7,"relationship_type":"parent-child","created_at":"2025-08-05 13:12:29"},
      {"id":9,"parent_id":5,"child_id":8,"relationship_type":"parent-child","created_at":"2025-08-05 13:12:46"},
      {"id":10,"parent_id":7,"child_id":8,"relationship_type":"parent-child","created_at":"2025-08-05 13:12:52"},
      {"id":11,"parent_id":9,"child_id":7,"relationship_type":"parent-child","created_at":"2025-08-05 13:14:06"}
    ])
  }
}
  
  // Calculate bounds for positioning
  const bounds = membersData.length > 0 ? {
    minX: Math.min(...membersData.map(m => m.x_position)) - 200,
    maxX: Math.max(...membersData.map(m => m.x_position)) + 200,
    minY: Math.min(...membersData.map(m => m.y_position)) - 200,
    maxY: Math.max(...membersData.map(m => m.y_position)) + 200,
  } : { minX: 0, maxX: 1000, minY: 0, maxY: 1000 }
  
  const width = bounds.maxX - bounds.minX
  const height = bounds.maxY - bounds.minY
  
  // Convert absolute positions to relative positions within the container
  const getRelativePosition = (member: FamilyMember) => ({
    x: member.x_position - bounds.minX,
    y: member.y_position - bounds.minY,
  })
  
  // Handle zoom
  const handleZoom = useCallback((delta: number, clientX?: number, clientY?: number) => {
    const newZoom = Math.max(0.1, Math.min(3, zoom + delta))
    
    if (clientX !== undefined && clientY !== undefined && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      
      const zoomFactor = newZoom / zoom
      setPan(prev => ({
        x: x - (x - prev.x) * zoomFactor,
        y: y - (y - prev.y) * zoomFactor,
      }))
    }
    
    setZoom(newZoom)
  }, [zoom])
  
  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    handleZoom(delta, e.clientX, e.clientY)
  }, [handleZoom])
  
  // Handle mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === contentRef.current) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setLastPan(pan)
    }
  }, [pan])
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setPan({
        x: lastPan.x + deltaX,
        y: lastPan.y + deltaY,
      })
    }
  }, [isDragging, dragStart, lastPan])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX, y: touch.clientY })
      setLastPan(pan)
    }
  }, [pan])
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0]
      const deltaX = touch.clientX - dragStart.x
      const deltaY = touch.clientY - dragStart.y
      setPan({
        x: lastPan.x + deltaX,
        y: lastPan.y + deltaY,
      })
    }
  }, [isDragging, dragStart, lastPan])
  
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  // Reset view
  const resetView = useCallback(() => {
    setZoom(0.8)
    setPan({ x: 0, y: 0 })
  }, [])
  
  // Fit to view
  const fitToView = useCallback(() => {
    if (containerRef.current && membersData.length > 0) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const scaleX = containerRect.width / width
      const scaleY = containerRect.height / height
      const newZoom = Math.min(scaleX, scaleY) * 0.9
      
      setZoom(newZoom)
      setPan({
        x: (containerRect.width - width * newZoom) / 2,
        y: (containerRect.height - height * newZoom) / 2,
      })
    }
  }, [width, height, membersData.length])
  
  // Event listeners
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        container.removeEventListener('wheel', handleWheel)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [handleWheel, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])
  
  // Initialize view
  useEffect(() => {
    if (membersData.length > 0) {
      const timer = setTimeout(() => {
        fitToView()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [fitToView, membersData.length])
  
  // Create arrow path between two points
  const createArrowPath = (parent: FamilyMember, child: FamilyMember) => {
    const parentPos = getRelativePosition(parent)
    const childPos = getRelativePosition(child)
    
    const nodeSize = 40
    const dx = childPos.x - parentPos.x
    const dy = childPos.y - parentPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    const startX = parentPos.x + (dx / distance) * nodeSize
    const startY = parentPos.y + (dy / distance) * nodeSize
    const endX = childPos.x - (dx / distance) * nodeSize
    const endY = childPos.y - (dy / distance) * nodeSize
    
    return { startX, startY, endX, endY }
  }
  
  // Calculate age
  const calculateAge = (birthDate: string, deathDate?: string) => {
    const birth = new Date(birthDate)
    const end = deathDate ? new Date(deathDate) : new Date()
    return Math.floor((end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  // Get relationship info for a member
  const getRelationshipInfo = (memberId: number) => {
    const children = relationshipsData.filter(r => r.parent_id === memberId).length
    const parents = relationshipsData.filter(r => r.child_id === memberId).length
    return { children, parents }
  }

  // Show loading if no stats
  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading family tree...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Minimal Header section matching edit mode style */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-white" />
              {stats.familyName} Family
            </h1>
            <div className="flex items-center space-x-6 text-sm text-white/90">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-white/80" />
                <span>{stats.totalMembers} Members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-white/80" />
                <span>{stats.generations} Generations</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-white/80" />
                <span>{stats.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/80">Zoom and pan to explore • Click members for details</span>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-white/30 text-purple-700 hover:bg-white/20 hover:text-white">
                <Edit className="w-4 h-4 mr-1" />
                Edit Mode
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Tree Container */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-br from-blue-50 to-indigo-50"
        style={{ height: 'calc(100vh - 80px)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Floating zoom controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 border shadow-lg">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleZoom(0.2)}
              disabled={zoom >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleZoom(-0.2)}
              disabled={zoom <= 0.1}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
          
          <Button size="sm" variant="outline" onClick={fitToView} className="bg-white/90 backdrop-blur-sm">
            <Move className="w-4 h-4 mr-1" />
            Fit
          </Button>
          
          <Button size="sm" variant="outline" onClick={resetView} className="bg-white/90 backdrop-blur-sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
        <div 
          ref={contentRef}
          className="relative origin-top-left"
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: `${width}px`, 
            height: `${height}px`,
          }}
        >
          {/* SVG for connections */}
          <svg 
            className="absolute inset-0 pointer-events-none z-10"
            width={width}
            height={height}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6366f1"
                />
              </marker>
            </defs>
            
            {relationshipsData.map((relationship) => {
              const parent = membersData.find(m => m.id === relationship.parent_id)
              const child = membersData.find(m => m.id === relationship.child_id)
              
              if (!parent || !child) return null
              
              const { startX, startY, endX, endY } = createArrowPath(parent, child)
              
              return (
                <line
                  key={relationship.id}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#6366f1"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  className="drop-shadow-sm"
                />
              )
            })}
          </svg>
          
          {/* Family member nodes with enhanced details */}
          {membersData.map((member) => {
            const position = getRelativePosition(member)
            const age = calculateAge(member.date_of_birth, member.date_of_death || undefined)
            const relationshipInfo = getRelationshipInfo(member.id)
            
            return (
              <Card
                key={member.id}
                className={`absolute z-20 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 pointer-events-auto min-w-[140px] max-w-[200px] ${
                  selectedMember?.id === member.id 
                    ? 'border-purple-500 shadow-xl scale-105 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
                style={{
                  left: `${position.x - 70}px`,
                  top: `${position.y - 50}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedMember(member)
                }}
              >
                <div className="p-3">
                  {/* Avatar and basic info */}
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="w-12 h-12 border-2 border-purple-200">
                      <AvatarImage src={member.picture_url || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="bg-purple-600 text-white text-sm font-bold">
                        {member.name.charAt(0)}{member.surname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="text-center">
                      <h3 className="font-bold text-sm text-gray-800 leading-tight">
                        {member.name} {member.surname}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">
                        {member.totem}
                      </p>
                    </div>
                  </div>
                  
                  {/* Compact details */}
                  <div className="mt-2 text-center">
                    <div className="text-xs text-gray-500">
                      Born: {new Date(member.date_of_birth).toLocaleDateString('en-US', { 
                        month: '2-digit', 
                        day: '2-digit', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-gray-700 font-medium">
                      Age {age}
                    </div>
                    
                    {/* Relationship indicators - no IDs */}
                    {(relationshipInfo.children > 0 || relationshipInfo.parents > 0) && (
                      <div className="flex justify-center space-x-3 pt-1 mt-1 border-t border-gray-100">
                        {relationshipInfo.children > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-blue-600">
                            <Baby className="w-3 h-3" />
                            <span>{relationshipInfo.children}</span>
                          </div>
                        )}
                        {relationshipInfo.parents > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-green-600">
                            <Heart className="w-3 h-3" />
                            <span>{relationshipInfo.parents}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
      
      {/* Enhanced selected member details */}
      {selectedMember && (
        <div className="fixed bottom-6 right-6 z-30 max-w-sm">
          <Card className="bg-white shadow-2xl border-purple-200 border-2">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-20 h-20 border-3 border-purple-200">
                  <AvatarImage src={selectedMember.picture_url || "/placeholder.svg"} alt={selectedMember.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-xl font-bold">
                    {selectedMember.name.charAt(0)}{selectedMember.surname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-800 mb-1">
                    {selectedMember.name} {selectedMember.surname}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-purple-700 border-purple-300">
                        {selectedMember.totem} Totem
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block">Born:</span>
                        <span className="font-medium text-gray-700">
                          {new Date(selectedMember.date_of_birth).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-gray-500 block">Age:</span>
                        <span className="font-medium text-gray-700">
                          {calculateAge(selectedMember.date_of_birth, selectedMember.date_of_death || undefined)} years
                        </span>
                      </div>
                      
                      {selectedMember.date_of_death && (
                        <div className="col-span-2">
                          <span className="text-gray-500 block">Died:</span>
                          <span className="font-medium text-gray-700">
                            {new Date(selectedMember.date_of_death).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Family Connections:</span>
                        <div className="flex space-x-3">
                          <span className="flex items-center space-x-1 text-blue-600">
                            <Baby className="w-3 h-3" />
                            <span>{getRelationshipInfo(selectedMember.id).children} children</span>
                          </span>
                          <span className="flex items-center space-x-1 text-green-600">
                            <Heart className="w-3 h-3" />
                            <span>{getRelationshipInfo(selectedMember.id).parents} parents</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="mt-4 w-full text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
