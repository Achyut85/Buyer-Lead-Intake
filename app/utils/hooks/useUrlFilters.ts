"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useUrlFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (key: string | Record<string, string | null>, value?: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (typeof key === "string") {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    } else {
      // multiple keys at once
      Object.entries(key).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
    }

    router.push(`?${params.toString()}`);
  };

  return {
    filters: {
      city: searchParams.get("city") || "",
      propertyType: searchParams.get("propertyType") || "",
      status: searchParams.get("status") || "",
      timeline: searchParams.get("timeline") || "",
    },
    setFilter,
  };
}
