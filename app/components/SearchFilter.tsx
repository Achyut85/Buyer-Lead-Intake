"use client"

import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { SearchIcon, Filter } from "lucide-react"

export default function SearchFilter() {
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex w-full sm:max-w-sm items-center gap-2">
        <Input type="text" placeholder="Search by email" />
        <Button type="submit" variant="outline">
          <SearchIcon />
        </Button>
      </div>
      <Button type="button" variant="outline" className="w-full sm:w-auto">
        <Filter /> Filters
      </Button>
    </div>
  )
}
