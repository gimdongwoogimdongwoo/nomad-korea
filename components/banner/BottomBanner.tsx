import { TrendingUp, Calendar } from "lucide-react"

export function BottomBanner() {
  return (
    <div className="mt-10 rounded-xl bg-primary text-primary-foreground px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm font-medium">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            📊 이번 달 급상승:{" "}
            <span className="font-bold underline underline-offset-2">강릉</span>
            <span className="font-normal opacity-80"> ↑</span>
          </span>
        </div>
        <span className="hidden sm:block opacity-40">·</span>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            🥥 다가오는 밋업:{" "}
            <span className="font-bold">7/18 성수 코워킹 모임</span>
          </span>
        </div>
      </div>
    </div>
  )
}
