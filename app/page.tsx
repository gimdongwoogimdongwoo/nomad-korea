import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomBanner } from "@/components/banner/BottomBanner"
import { CityExplorer } from "@/components/city/CityExplorer"
import { mapCityRow } from "@/lib/cities"
import type { CityRow } from "@/lib/cities"

export default async function Home() {
  const supabase = await createClient()

  const [{ data: cityRows }, { data: { user } }] = await Promise.all([
    supabase.from("cities").select("*").order("rank"),
    supabase.auth.getUser(),
  ])

  const cities = (cityRows as CityRow[] ?? []).map(mapCityRow)

  let wishlistedIds: string[] = []
  if (user) {
    const { data } = await supabase
      .from("wishlists")
      .select("city_id")
      .eq("user_id", user.id)
    wishlistedIds = (data ?? []).map((r: { city_id: string }) => r.city_id)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 pb-10">
        <CityExplorer cities={cities} wishlistedIds={wishlistedIds} />
        <BottomBanner />
      </main>

      <Footer />
    </div>
  )
}
