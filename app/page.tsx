import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Plus, Upload, Download, SearchIcon, Filter } from "lucide-react";
import LeadsTable from "./components/LeadsTable";
import Link from "next/link";


export default function Home() {
  return (
    <div className=" lg:ml-12 border-l px-6 py-4 lg:h-screen border-slate-200 ">
      {/* <Navbar/> */}

      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center">
          {/* Title */}
          <div className="text-center lg:text-left mb-2 lg:mb-0">
            <h1 className="text-3xl font-bold">Buyers</h1>
            <p className="text-slate-600 text-sm">Know your buyers information.</p>
          </div>
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Upload /> Import
            </Button>
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
          <li className="cursor-pointer">All Buyers</li>
          <li className="cursor-pointer text-slate-400">Your Leads</li>
        </ul>
      </div>

      {/* Search + Filters */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex w-full sm:max-w-sm items-center gap-2">
          <Input type="email" placeholder="Search by email" />
          <Button type="submit" variant="outline">
            <SearchIcon />
          </Button>
        </div>
        <Button type="button" variant="outline" className="w-full sm:w-auto">
          <Filter /> Filters
        </Button>
      </div>

      {/* Table */}
      <LeadsTable />

    </div>
  );
}
