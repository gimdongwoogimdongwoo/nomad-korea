"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface WishlistButtonProps {
  cityId: string
  isWishlisted: boolean
  size?: "sm" | "default"
}

export function WishlistButton({ cityId, isWishlisted: initial, size = "sm" }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(initial)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      setLoading(false)
      return
    }

    if (isWishlisted) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("city_id", cityId)
      setIsWishlisted(false)
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, city_id: cityId })
      setIsWishlisted(true)
    }
    setLoading(false)
  }

  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        "gap-1",
        isWishlisted ? "text-red-500" : "text-muted-foreground hover:text-red-500"
      )}
      onClick={toggle}
      disabled={loading}
    >
      <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")} />
      찜
    </Button>
  )
}
