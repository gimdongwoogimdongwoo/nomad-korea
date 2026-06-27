"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { FilterPanel } from "./FilterPanel"
import type { FilterState } from "@/types/filter"

const DEFAULT_FILTER: FilterState = {
  budget: 300,
  highSpeed: false,
  cleanAir: false,
  selectedTags: [],
}

interface MobileFilterSheetProps {
  filter?: FilterState
  onFilterChange?: (patch: Partial<FilterState>) => void
}

export function MobileFilterSheet({
  filter = DEFAULT_FILTER,
  onFilterChange = () => {},
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 mb-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          필터
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto p-4">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              필터
            </SheetTitle>
          </SheetHeader>
          <FilterPanel filter={filter} onFilterChange={onFilterChange} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
