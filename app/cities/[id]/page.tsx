import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { GaugeBar } from "@/components/city/GaugeBar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/components/ui/button"
import { WishlistButton } from "@/components/city/WishlistButton"
import { ReviewForm } from "@/components/city/ReviewForm"
import { createClient } from "@/lib/supabase/server"
import { mapCityRow } from "@/lib/cities"
import type { CityRow } from "@/lib/cities"
import { cn } from "@/lib/utils"

function formatCost(won: number) {
  return `₩${won.toLocaleString("ko-KR")}`
}

export default async function CityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: cityRow },
    { data: reviewRows },
    { data: { user } },
  ] = await Promise.all([
    supabase.from("cities").select("*").eq("id", id).single(),
    supabase.from("reviews").select("*").eq("city_id", id).order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!cityRow) notFound()
  const city = mapCityRow(cityRow as CityRow)

  let isWishlisted = false
  if (user) {
    const { data } = await supabase
      .from("wishlists")
      .select("city_id")
      .eq("user_id", user.id)
      .eq("city_id", id)
      .maybeSingle()
    isWishlisted = !!data
  }

  const cityReviews = reviewRows ?? []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* Back */}
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6 gap-1.5")}
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        {/* City header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl" role="img" aria-label={city.name}>
            {city.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-3xl font-bold">{city.name}</h1>
              <Badge variant="secondary" className="text-sm font-bold">
                #{city.rank}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-1">{city.region}</p>
            <p className="text-xl font-semibold">⭐ {city.rating}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {city.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <WishlistButton cityId={city.id} isWishlisted={isWishlisted} size="default" />
        </div>

        <Separator className="mb-6" />

        {/* Costs */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">💰 생활비</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground mb-1">월 생활비</p>
              <p className="text-xl font-bold">{formatCost(city.monthlyCost)}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground mb-1">원룸 월세</p>
              <p className="text-xl font-bold">{formatCost(city.rentCost)}</p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">📊 지표</h2>
          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-5 shrink-0" aria-hidden>📡</span>
              <span className="text-muted-foreground w-24 shrink-0">인터넷</span>
              <GaugeBar score={city.internetScore} colorScheme="blue" label={city.internetSpeed} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-5 shrink-0" aria-hidden>☕</span>
              <span className="text-muted-foreground w-24 shrink-0">카페·코워킹</span>
              <GaugeBar score={city.cafeScore} colorScheme="orange" label={city.cafeLabel} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-5 shrink-0" aria-hidden>🌤️</span>
              <span className="text-muted-foreground w-24 shrink-0">미세먼지</span>
              <GaugeBar score={city.airScore} colorScheme="green" label={city.airLabel} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-5 shrink-0" aria-hidden>🚇</span>
              <span className="text-muted-foreground w-24 shrink-0">교통</span>
              <GaugeBar score={city.transportScore} colorScheme="gray" label={city.transportLabel} />
            </div>
          </div>
        </section>

        {/* Reactions */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">💬 커뮤니티 반응</h2>
          <div className="flex items-center gap-6 text-sm text-muted-foreground rounded-xl border p-4">
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4" aria-hidden />
              <span aria-label={`좋아요 ${city.likes}개`}>{city.likes.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ThumbsDown className="h-4 w-4" aria-hidden />
              <span aria-label={`싫어요 ${city.dislikes}개`}>{city.dislikes.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" aria-hidden />
              <span aria-label={`후기 ${cityReviews.length}개`}>후기 {cityReviews.length.toLocaleString()}개</span>
            </span>
          </div>
        </section>

        <Separator className="mb-6" />

        {/* Reviews */}
        <section>
          <h2 className="text-lg font-semibold mb-3">
            🗣️ 노마드 후기 ({cityReviews.length}개)
          </h2>

          <div className="mb-4">
            <ReviewForm cityId={city.id} isLoggedIn={!!user} />
          </div>

          {cityReviews.length === 0 ? (
            <p className="text-muted-foreground text-sm">아직 후기가 없어요. 첫 번째 후기를 남겨보세요!</p>
          ) : (
            <div className="space-y-3">
              {cityReviews.map((review) => (
                <div key={review.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{review.author}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>⭐ {review.rating}</span>
                      <span>{new Date(review.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long" })}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
