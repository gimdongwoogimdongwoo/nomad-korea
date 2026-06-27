import { SearchBar } from "./SearchBar"

const stats = [
  { emoji: "👥", value: "12,400명", label: "노마드" },
  { emoji: "🏙️", value: "24개", label: "도시" },
  { emoji: "🗣️", value: "3,200개", label: "후기" },
]

interface HeroSectionProps {
  searchQuery?: string
  onSearchChange?: (v: string) => void
}

export function HeroSection({ searchQuery = "", onSearchChange = () => {} }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/10 border border-border/50 px-6 py-14 md:px-12 md:py-20 my-6">
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        {/* Headline */}
        <div className="space-y-3">
          <p className="text-4xl md:text-5xl font-bold tracking-tight">
            🌏 한국에서 일하며 살기 좋은
            <br />
            <span className="text-primary">도시</span>를 찾아보세요
          </p>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
            실제 노마드들이 매긴 생활비·인터넷·카페·미세먼지 데이터로 비교하세요
          </p>
        </div>

        {/* Search */}
        <SearchBar value={searchQuery} onChange={onSearchChange} />

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>{stat.emoji}</span>
              <span className="font-semibold text-foreground">{stat.value}</span>
              <span>의 {stat.label}</span>
              {i < stats.length - 1 && (
                <span className="ml-4 text-border hidden sm:inline">·</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>
    </section>
  )
}
