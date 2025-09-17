
"use client";

import LeadsTable, { Lead } from "./components/LeadsTable";
import { useState, useEffect } from "react"
import Header from "./components/Header";
import SearchFilter from "./components/SearchFilter";


export default function Home() {

  const [buyers, setBuyers] = useState<Lead[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  

  useEffect(() => {
  fetch(`/api/buyers?page=${page}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data?.buyers || !Array.isArray(data.buyers)) {
        setBuyers([]); // fallback empty list
        setTotalPages(1); 
        return;
      }

      const leads: Lead[] = data.buyers.map((b: any) => ({
        id: b.id,
        name: b.fullName,
        phone: b.phone,
        city: b.city,
        propertyType: b.propertyType,
        budget: b.budgetMin && b.budgetMax
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
      console.log("buyers:", data.buyers);
      setTotalPages(data.totalPages || 1);
    })
    .catch((err) => {
      console.error("Error fetching buyers:", err);
      setBuyers([]);
    });
}, [page]);

  return (
    <div className=" lg:ml-12 border-l px-6 py-4  border-slate-200 ">
      {/* <Navbar/> */}
      <Header />
      <SearchFilter />
      <LeadsTable
        leads={buyers}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage} />
    </div>
  );
}
