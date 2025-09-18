"use client";

import LeadsTable, { Lead } from "./components/LeadsTable";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import { useSearchParams } from "next/navigation";
import BuyerFilters from "./components/BuyerFilters";
import Navbar from "./components/Navbar";

export default function Home() {
  const [buyers, setBuyers] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();

  // ref to scroll
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", page.toString()); // always include page

    fetch(`/api/buyers?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data?.buyers || !Array.isArray(data.buyers)) {
          setBuyers([]);
          setTotalPages(1);
          return;
        }

        const leads: Lead[] = data.buyers.map((b: any) => ({
          id: b.id,
          name: b.fullName,
          phone: b.phone,
          city: b.city,
          propertyType: b.propertyType,
          budget:
            b.budgetMin && b.budgetMax
              ? `₹${b.budgetMin} – ₹${b.budgetMax}`
              : b.budgetMin
              ? `₹${b.budgetMin}`
              : b.budgetMax
              ? `₹${b.budgetMax}`
              : "NA",
          timeline: b.timeline,
          status: b.status,
          updatedAt: b.updatedAt
            ? new Date(b.updatedAt).toLocaleDateString()
            : "NA",
        }));

        setBuyers(leads);
        setTotalPages(data.totalPages || 1);

        // scroll to table after data fetch
        tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch((err) => {
        console.error("Error fetching buyers:", err);
        setBuyers([]);
      });
  }, [page, searchParams]);

  return (
    <div className=" lg:border-x px-6 py-4 border-gray-300 max-w-7xl w-full ">
      <Navbar/>
      <Header />
      <BuyerFilters />
      {/* attach ref here */}
      <div ref={tableRef}>
        <LeadsTable
          leads={buyers}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
