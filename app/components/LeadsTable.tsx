"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { MoreHorizontal, Phone, MapPin, Calendar } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination"

export type Lead = {
  id: string
  name: string
  phone: string
  city: string
  propertyType: string
  budget: string
  timeline: string
  status: string
  updatedAt: string
}

type LeadTableProps = {
  leads: Lead[]
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
}

const STATUS_COLORS = {
  New: "bg-blue-100 text-blue-700",
  Qualified: "bg-indigo-100 text-indigo-700",
  Contacted: "bg-gray-100 text-gray-700",
  Visited: "bg-purple-100 text-purple-700",
  Negotiation: "bg-yellow-100 text-yellow-700",
  Converted: "bg-green-100 text-green-700",
  Dropped: "bg-red-100 text-red-700",
} as const

function getStatusColor(status: string) {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-700"
}

// Generate pagination numbers
function getPaginationNumbers(current: number, total: number, isMobile: boolean) {
  const maxVisible = isMobile ? 3 : 7
  const pages: (number | "...")[] = []

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const sideWidth = isMobile ? 1 : 2
  const leftWidth = current - 1
  const rightWidth = total - current
  const shouldShowLeftEllipsis = leftWidth > sideWidth
  const shouldShowRightEllipsis = rightWidth > sideWidth

  // Always show first page
  pages.push(1)

  // Left ellipsis
  if (shouldShowLeftEllipsis) pages.push("...")

  // Pages around current
  const startPage = shouldShowLeftEllipsis ? current - 1 : 2
  const endPage = shouldShowRightEllipsis ? current + 1 : total - 1

  for (let i = startPage; i <= endPage; i++) {
    if (i > 1 && i < total) pages.push(i)
  }

  // Right ellipsis
  if (shouldShowRightEllipsis) pages.push("...")

  // Always show last page if total > 1
  if (total > 1) pages.push(total)

  return pages
}


const TIMELINE_LABELS: Record<string, string> = {
  ZERO_TO_THREE_MONTHS: "0-3m",
  THREE_TO_SIX_MONTHS: "3-6m",
  MORE_THAN_SIX_MONTHS: ">6m",
  EXPLORING: "Exploring",
};


// Mobile card component
function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 mt-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{lead.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
            <Phone className="w-3 h-3" />
            {lead.phone}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert(`Viewing ${lead.name}`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Editing ${lead.name}`)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            {lead.city}
          </div>
          <div className="text-gray-900 font-medium mt-1">{lead.propertyType}</div>
        </div>
        <div>
          <div className="text-gray-600">Budget</div>
          <div className="text-gray-900 font-medium">{lead.budget}</div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="w-3 h-3" />
          {TIMELINE_LABELS[lead.timeline]}
        </div>
        <Badge className={`${getStatusColor(lead.status)} px-2 py-1 text-xs`}>
          {lead.status}
        </Badge>
      </div>

      <div className="text-xs text-gray-500">
        Updated: {lead.updatedAt}
      </div>
    </div>
  )
}

export default function LeadsTable({ leads, page, totalPages, onPageChange }: LeadTableProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const paginationNumbers = useMemo(
    () => getPaginationNumbers(page, totalPages, isMobile),
    [page, totalPages, isMobile]
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && onPageChange) {
      onPageChange(newPage)
    }
  }





  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent className="flex justify-center gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(page - 1)}
                  className={page === 1 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>

              {paginationNumbers.map((p, idx) =>
                p === "..." ? (
                  <span key={idx} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={() => handlePageChange(p as number)}
                      className="w-8 h-8"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                  className={page === totalPages ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-left font-medium">Name</TableHead>
                <TableHead className="text-left font-medium">Contact</TableHead>
                <TableHead className="text-left font-medium">City</TableHead>
                <TableHead className="text-left font-medium">Property</TableHead>
                <TableHead className="text-center font-medium">Budget</TableHead>
                <TableHead className="text-center font-medium">Timeline</TableHead>
                <TableHead className="text-center font-medium">Status</TableHead>
                <TableHead className="text-center font-medium">Updated</TableHead>
                <TableHead className="text-center font-medium w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell><div className="text-sm">{lead.phone}</div>
                  </TableCell>
                  <TableCell><div className="text-sm">{lead.city}</div>
                  </TableCell>
                  <TableCell>{lead.propertyType}</TableCell>
                  <TableCell className="text-center">{lead.budget}</TableCell>
                  <TableCell className="text-center">{TIMELINE_LABELS[lead.timeline]}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getStatusColor(lead.status)} px-2 py-1 text-xs`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">{lead.updatedAt}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert(`Viewing ${lead.name}`)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Editing ${lead.name}`)}>
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="flex justify-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(page - 1)}
                className={page === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>

            {paginationNumbers.map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              ) : (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={() => handlePageChange(p as number)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(page + 1)}
                className={page === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}