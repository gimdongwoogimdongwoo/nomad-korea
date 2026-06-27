import { SlidersHorizontal } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface FilterSidebarProps {
  children: React.ReactNode
}

export function FilterSidebar({ children }: FilterSidebarProps) {
  return (
    <aside className="rounded-xl border border-border bg-card p-4 sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4 w-4" />
        <h2 className="font-semibold text-sm">필터</h2>
      </div>
      <Separator className="mb-4" />
      {children}
    </aside>
  )
}
