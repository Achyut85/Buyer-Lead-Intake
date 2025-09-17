"use client";
import { Button } from "./ui/button";

export function DownloadTestCsv() {
  const handleDownload = () => {
    const headers = [
      "fullName","email","phone","city","propertyType","bhk","purpose",
      "budgetMin","budgetMax","timeline","source","notes","tags","status"
    ];

    const cities = ["Chandigarh","Mohali","Zirakpur","Panchkula","Other"];
    const propertyTypes = ["Apartment","Villa","Plot","Office","Retail"];
    const bhks = ["1","2","3","4","Studio"];
    const purposes = ["Buy","Rent"];
    const timelines = ["0-3m","3-6m",">6m","Exploring"];
    const sources = ["Website","Referral","Walk_in","Call","Other"];
    const statuses = ["New","Qualified","Contacted","Visited","Negotiation","Converted","Dropped"];

    // Generate 200 rows
    const rows = Array.from({ length: 200 }).map((_, i) => [
      `Test User ${i+1}`,
      `user${i+1}@example.com`,
      `987650${1000 + i}`,
      cities[i % cities.length],
      propertyTypes[i % propertyTypes.length],
      bhks[i % bhks.length],
      purposes[i % purposes.length],
      (50000 + i*1000).toString(),
      (70000 + i*1000).toString(),
      timelines[i % timelines.length],
      sources[i % sources.length],
      "Sample notes",
      "buyer",
      statuses[i % statuses.length]
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "buyers_test.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleDownload} variant="outline">Download Test CSV</Button>;
}
