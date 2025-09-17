"use client"

import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import {  Download, Plus } from "lucide-react"
import { usePathname } from "next/navigation";
import { ImportModal } from "./ImportModal";

export default function Header() {
    const pathname = usePathname();
  return (
    <div className="border-b border-slate-200 pb-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
        {/* Title */}
        <div className="text-center lg:text-left mb-2 lg:mb-0">
          <h1 className="text-3xl font-bold">Buyers</h1>
          <p className="text-slate-600 text-sm">Know your buyers information.</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <ImportModal/>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download /> Export
          </Button>
          <Link href="/buyers/new">
            <Button variant="blue" size="sm" className="w-full sm:w-auto">
              <Plus /> Add New
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <ul className="flex items-center gap-5 mt-5 text-sm">
        <li className="cursor-pointer">   <Link
          href="/"
          className={`cursor-pointer ${
            pathname === "/" ? " font-semibold" : "text-slate-400"
          }`}
        >
          All Buyers
        </Link></li>

        <li className="cursor-pointer "> <Link
          href="/buyers"
          className={`cursor-pointer ${
            pathname === "/buyers"
              ? "font-semibold"
              : "text-slate-400"
          }`}
        >
          Your Leads
        </Link></li>
      </ul>
    </div>
  )
}
