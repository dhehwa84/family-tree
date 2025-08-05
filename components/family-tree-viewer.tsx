"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin, Edit } from "lucide-react";
import Link from "next/link";
import type { FamilyMember, FamilyRelationship } from "@/lib/database";

// Dynamically import react-d3-tree to ensure it's only loaded on the client-side
const Tree = dynamic(() => import("react-d3-tree").then((mod) => mod.default), {
  ssr: false,
});

// Interface for overall family statistics
interface FamilyStats {
  totalMembers: number;
  generations: number;
  familyName: string;
  location: string;
}

// Interface for a node in the D3 tree structure
interface TreeNode {
  id?: number;
  name: string;
  attributes?: Record<string, string>;
  children?: TreeNode[];
}

// Interface for an extra link (e.g., from a second parent to a child)
interface ExtraLink {
  from: number;
  to: number;
}

export function FamilyTreeViewer() {
  // State variables to hold family data and tree structure
  const [stats, setStats] = useState<FamilyStats | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [extraLinks, setExtraLinks] = useState<ExtraLink[]>([]);

  // Ref to the container div for the tree, used to calculate element positions
  const treeContainerRef = useRef<HTMLDivElement>(null);

  // useEffect to load data when the component mounts
  useEffect(() => {
    loadData();
  }, []);

  // useEffect to calculate and inject arrows whenever treeData or extraLinks change
  // This ensures arrows are redrawn when the tree structure or relationships update
  useEffect(() => {
    if (treeData.length > 0 && extraLinks.length > 0) {
      // Use requestAnimationFrame to ensure the DOM has settled before measuring positions
      requestAnimationFrame(() => {
        calculateAndInjectArrows();
      });
    }
  }, [treeData, extraLinks]);

  /**
   * Fetches family statistics, members, and relationships from the API
   * and then builds the tree data structure.
   */
  const loadData = async () => {
    try {
      const [statsRes, membersRes, relationshipsRes] = await Promise.all([
        fetch("/api/family-stats"),
        fetch("/api/family-members"),
        fetch("/api/relationships"),
      ]);

      const statsData = await statsRes.json();
      const membersData: FamilyMember[] = await membersRes.json();
      const relationshipsData: FamilyRelationship[] = await relationshipsRes.json();

      // Build the tree structure and identify extra links
      const { roots, extraLinks: generatedExtraLinks } = buildTreeData(
        membersData,
        relationshipsData
      );

      setStats(statsData);
      setTreeData(roots);
      setExtraLinks(generatedExtraLinks);
    } catch (error) {
      console.error("Failed to load family data:", error);
    }
  };

  /**
   * Builds the hierarchical tree data structure for react-d3-tree
   * and identifies "extra links" for relationships not covered by the primary hierarchy.
   *
   * @param members Array of FamilyMember objects.
   * @param relationships Array of FamilyRelationship objects.
   * @returns An object containing the root nodes of the tree and an array of extra links.
   */
  const buildTreeData = (
    members: FamilyMember[],
    relationships: FamilyRelationship[]
  ): { roots: TreeNode[]; extraLinks: ExtraLink[] } => {
    const memberMap = new Map<number, TreeNode>();
    const childToParents = new Map<number, number[]>();
    const allChildren = new Set<number>();
    const extraLinks: ExtraLink[] = []; // This will store links for secondary parents

    // Initialize a map of members for quick lookup and to store tree nodes
    members.forEach((member) => {
      memberMap.set(member.id, {
        id: member.id,
        name: `${member.name} ${member.surname}`,
        attributes: {
          Totem: member.totem || "-",
          Birth: member.date_of_birth || "-",
          Death: member.date_of_death || "-",
        },
        children: [], // Initialize children array for each node
      });
    });

    // Populate childToParents map and identify all children
    relationships.forEach((rel) => {
      allChildren.add(rel.child_id);
      if (!childToParents.has(rel.child_id)) {
        childToParents.set(rel.child_id, []);
      }
      childToParents.get(rel.child_id)!.push(rel.parent_id);
    });

    // Build the primary tree hierarchy and identify secondary parent links
    childToParents.forEach((parents, childId) => {
      if (parents.length > 0) {
        // The first parent in the list becomes the primary parent for the D3 tree hierarchy
        const primaryParent = parents[0];
        const childNode = memberMap.get(childId);

        if (memberMap.has(primaryParent) && childNode) {
          // Add child to primary parent's children array
          memberMap.get(primaryParent)!.children!.push(childNode);
        }

        // For any other parents, create an "extra link"
        parents.forEach((p) => {
          if (p !== primaryParent) {
            extraLinks.push({ from: p, to: childId });
          }
        });
      }
    });

    // Determine root nodes (members who are not children of anyone)
    const roots = members
      .filter((m) => !allChildren.has(m.id))
      .map((m) => memberMap.get(m.id)!);

    return { roots, extraLinks };
  };

  /**
   * Calculates the SVG path data for extra links and injects them into the D3 tree's SVG.
   * This ensures the extra links move and scale with the main tree.
   */
  const calculateAndInjectArrows = () => {
    if (!treeContainerRef.current || extraLinks.length === 0) return;

    // Get the main SVG element and the D3 tree's group element
    const svgEl = treeContainerRef.current.querySelector("svg") as SVGSVGElement;
    if (!svgEl) return;

    const gEl = svgEl.querySelector("g.rd3t-g") as SVGGElement;
    if (!gEl) return;

    // Get the current transformation matrix of the g element
    const transformMatrix = gEl.getCTM();
    if (!transformMatrix) return;

    // Get the inverse matrix to convert screen coordinates to the gEl's local coordinates
    const inverseMatrix = transformMatrix.inverse();

    const newPaths: string[] = [];

    extraLinks.forEach((link) => {
      // Find the HTML elements for the 'from' and 'to' nodes using their data-id attribute
      const fromEl = document.querySelector(
        `[data-id='${link.from}']`
      ) as HTMLElement | null;
      const toEl = document.querySelector(
        `[data-id='${link.to}']`
      ) as HTMLElement | null;

      if (!fromEl || !toEl) return;

      const fromBox = fromEl.getBoundingClientRect();
      const toBox = toEl.getBoundingClientRect();
      const containerBox = treeContainerRef.current!.getBoundingClientRect();

      // Calculate the center bottom of the 'from' node in screen coordinates
      const fromScreenX = fromBox.left + fromBox.width / 2;
      const fromScreenY = fromBox.bottom;

      // Calculate the center top of the 'to' node in screen coordinates
      const toScreenX = toBox.left + toBox.width / 2;
      const toScreenY = toBox.top;

      // Create SVGPoint objects for transformation
      let pt1 = svgEl.createSVGPoint();
      pt1.x = fromScreenX - containerBox.left; // Relative to SVG container
      pt1.y = fromScreenY - containerBox.top;

      let pt2 = svgEl.createSVGPoint();
      pt2.x = toScreenX - containerBox.left; // Relative to SVG container
      pt2.y = toScreenY - containerBox.top;

      // Apply the inverse transformation to get coordinates within the gEl's local space
      pt1 = pt1.matrixTransform(inverseMatrix);
      pt2 = pt2.matrixTransform(inverseMatrix);

      // Create a curved path (cubic Bezier curve) for the arrow
      newPaths.push(
        `M${pt1.x},${pt1.y} C${pt1.x},${(pt1.y + pt2.y) / 2} ${pt2.x},${(pt1.y + pt2.y) / 2} ${pt2.x},${pt2.y}`
      );
    });

    // Remove any previously injected extra link groups to prevent duplicates
    const oldExtra = gEl.querySelector("g.extra-links");
    if (oldExtra) oldExtra.remove();

    // Create a new SVG group for the extra links
    const ns = "http://www.w3.org/2000/svg"; // SVG namespace
    const extraGroup = document.createElementNS(ns, "g");
    extraGroup.setAttribute("class", "extra-links");

    // Append each new path to the extra links group
    newPaths.forEach((d) => {
      const pathEl = document.createElementNS(ns, "path");
      pathEl.setAttribute("d", d);
      pathEl.setAttribute("stroke", "#ff5722"); // Arrow color
      pathEl.setAttribute("stroke-width", "2");
      pathEl.setAttribute("fill", "none");
      pathEl.setAttribute("marker-end", "url(#arrowhead)"); // Attach arrowhead marker
      extraGroup.appendChild(pathEl);
    });

    // Append the new extra links group to the main D3 tree group
    gEl.appendChild(extraGroup);
  };

  /**
   * Generates initials for the circular avatar based on the full name.
   * @param fullName The full name of the family member.
   * @returns Initials (e.g., "SM" for Simon Madzvamutse).
   */
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Show a loading spinner if stats data is not yet available
  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading family tree...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header section with family name and statistics */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            👥 {stats.familyName} Family
          </h1>
          <div className="flex justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{stats.totalMembers} Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{stats.generations} Generations</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{stats.location}</span>
            </div>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Edit className="w-4 h-4 mr-2" />
              Switch to Edit Mode
            </Button>
          </Link>
        </div>
      </div>

      {/* Family Tree visualization area */}
      <div
        ref={treeContainerRef}
        style={{ width: "100%", height: "75vh", position: "relative" }}
      >
        <Tree
          data={treeData}
          translate={{ x: 400, y: 100 }} // Initial translation for tree positioning
          orientation="vertical" // Tree grows downwards
          pathFunc="elbow" // Style of connecting lines
          zoomable // Allow zooming
          collapsible // Allow collapsing/expanding nodes
          separation={{ siblings: 1.5, nonSiblings: 2 }} // Spacing between nodes
          nodeSize={{ x: 300, y: 200 }} // Size allocated for each node
          onUpdate={() => {
            // Callback fired after the tree updates (e.g., zoom, pan, collapse/expand)
            // Ensures extra links are redrawn to match new node positions
            requestAnimationFrame(() => {
              if (extraLinks.length > 0) {
                calculateAndInjectArrows();
              }
            });
          }}
          // Custom rendering for each node to display member details
          renderCustomNodeElement={({ nodeDatum }) => (
            <foreignObject
              width={250}
              height={140}
              x={-125}
              y={-70}
              data-id={nodeDatum.id} // Custom attribute to easily find nodes by ID
            >
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "12px",
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#7c3aed",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "16px",
                      margin: "0 auto",
                    }}
                  >
                    {getInitials(nodeDatum.name)}
                  </div>
                </div>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {nodeDatum.name}
                </div>
                <div style={{ color: "#555" }}>
                  <div>Totem: {nodeDatum.attributes?.Totem || "-"}</div>
                  <div>Birth: {nodeDatum.attributes?.Birth || "-"}</div>
                  <div>Death: {nodeDatum.attributes?.Death || "-"}</div>
                </div>
              </div>
            </foreignObject>
          )}
        />

        {/* SVG definition for the arrowhead marker. This needs to be outside the Tree component
            but within the same SVG context or a parent SVG. Placing it here makes it available
            for the dynamically injected paths. */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
              fill="#ff5722"
            >
              <polygon points="0 0, 10 3.5, 0 7" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
