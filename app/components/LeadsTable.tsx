"use client"

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
import { MoreHorizontal } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";

type Lead = {
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

const leads: Lead[] = [
  { id: "1", name: "John Doe", phone: "+91 9876543210", city: "Delhi", propertyType: "Apartment", budget: "₹50L – ₹70L", timeline: "0–3m", status: "New", updatedAt: "2025-09-10" },
  { id: "2", name: "Priya Sharma", phone: "+91 9123456780", city: "Bangalore", propertyType: "Villa", budget: "₹1Cr – ₹1.5Cr", timeline: "3–6m", status: "Negotiation", updatedAt: "2025-09-12" },
  { id: "3", name: "Amit Verma", phone: "+91 9998887770", city: "Chandigarh", propertyType: "Plot", budget: "₹70L – ₹90L", timeline: ">6m", status: "Converted", updatedAt: "2025-09-13" },
]

function getStatusColor(status: string) {
  switch (status) {
    case "New": return "bg-blue-100 text-blue-700"
    case "Qualified": return "bg-indigo-100 text-indigo-700"
    case "Contacted": return "bg-gray-100 text-gray-700"
    case "Visited": return "bg-purple-100 text-purple-700"
    case "Negotiation": return "bg-yellow-100 text-yellow-700"
    case "Converted": return "bg-green-100 text-green-700"
    case "Dropped": return "bg-red-100 text-red-700"
    default: return "bg-gray-100 text-gray-700"
  }
}

export default function LeadTable() {
  return (
    <div className="mt-4 border border-slate-300 rounded-2xl overflow-hidden">
      <Table className="[&_th]:align-middle [&_td]:align-middle">
        <TableHeader className="bg-accent/30">
          <TableRow>
            {["Name", "Phone", "City", "Property Type", "Budget", "Timeline", "Status", "Updated At", "Actions"].map((col) => (
              <TableHead
                key={col}
                className="text-sm font-medium text-muted-foreground text-center"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="text-center font-medium">{lead.name}</TableCell>
              <TableCell className="text-center">{lead.phone}</TableCell>
              <TableCell className="text-center">{lead.city}</TableCell>
              <TableCell className="text-center">{lead.propertyType}</TableCell>
              <TableCell className="text-center">{lead.budget}</TableCell>
              <TableCell className="text-center">{lead.timeline}</TableCell>
              <TableCell className="text-center">
                <Badge className={`${getStatusColor(lead.status)} px-2 py-1 rounded-md`}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{lead.updatedAt}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => alert(`Viewing ${lead.name}`)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert(`Editing ${lead.name}`)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination */}
      <Pagination className="border-t border-slate-200 py-2">
        <PaginationContent className="w-full px-3 flex justify-between lg:justify-center">
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          {[1, 2, 3].map((num) => (
            <PaginationItem key={num}>
              <PaginationLink href="#" isActive={num === 1}>
                {num}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {[8, 9, 10].map((num) => (
            <PaginationItem key={num} className="hidden sm:block">
              <PaginationLink href="#">{num}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>


  )
}
