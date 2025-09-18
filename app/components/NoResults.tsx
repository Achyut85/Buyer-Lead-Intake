"use client";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "./ui/button";

interface NoResultsProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function NoResults({
  title = "No results found",
  description = "Try adjusting your filters or search to see more results.",
  onReset,
}: NoResultsProps) {
  return (
    <Card className="w-full border-dashed mt-4  ">
      <CardContent className="flex flex-col items-center justify-center text-center py-10 px-4 sm:px-6 md:px-8">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">{description}</p>
        {onReset && (
          <Button 
            variant="outline" 
            onClick={onReset} 
            className="w-full sm:w-auto"
          >
            Reset Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
