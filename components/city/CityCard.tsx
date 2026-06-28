import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { GaugeBar } from "./GaugeBar"
import { WishlistButton } from "./WishlistButton"
import { cn } from "@/lib/utils"
import type { City } from "@/data/cities"

interface CityCardProps {
  city: City
  isWishlisted: boolean
}

function formatCost(won: number) {
  return `₩${won.toLocaleString("ko-KR")}`
}

export function CityCard({ city, isWishlisted }: CityCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label={city.name}>{city.emoji}</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">{city.name}</h3>
              <p className="text-xs text-muted-foreground">{city.region}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant="secondary" className="text-xs font-bold">
              #{city.rank}
            </Badge>
            <span className="text-sm font-semibold">⭐ {city.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3">
        {/* Cost */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">💵 월 생활비</span>
            <p className="font-semibold">{formatCost(city.monthlyCost)}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">🏠 원룸 월세</span>
            <p className="font-semibold">{formatCost(city.rentCost)}</p>
          </div>
        </div>

        <Separator />

        {/* Gauges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-4 shrink-0" aria-hidden>📡</span>
            <span className="text-muted-foreground w-16 shrink-0">인터넷</span>
            <GaugeBar score={city.internetScore} colorScheme="blue" label={city.internetSpeed} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-4 shrink-0" aria-hidden>☕</span>
            <span className="text-muted-foreground w-16 shrink-0">카페·코워킹</span>
            <GaugeBar score={city.cafeScore} colorScheme="orange" label={city.cafeLabel} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-4 shrink-0" aria-hidden>🌤️</span>
            <span className="text-muted-foreground w-16 shrink-0">미세먼지</span>
            <GaugeBar score={city.airScore} colorScheme="green" label={city.airLabel} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-4 shrink-0" aria-hidden>🚇</span>
            <span className="text-muted-foreground w-16 shrink-0">교통</span>
            <GaugeBar score={city.transportScore} colorScheme="gray" label={city.transportLabel} />
          </div>
        </div>

        <Separator />

        {/* Reactions */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
            <span aria-label={`좋아요 ${city.likes}개`}>{city.likes.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
            <span aria-label={`싫어요 ${city.dislikes}개`}>{city.dislikes.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
            <span aria-label={`후기 ${city.reviews}개`}>후기 {city.reviews.toLocaleString()}개</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {city.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Link
          href={`/cities/${city.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 gap-1")}
        >
          자세히
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        <WishlistButton cityId={city.id} isWishlisted={isWishlisted} />
      </CardFooter>
    </Card>
  )
}
