"use client"

import { useState, useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { submitReview } from "@/app/cities/actions"

interface ReviewFormProps {
  cityId: string
  isLoggedIn: boolean
}

export function ReviewForm({ cityId, isLoggedIn }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [state, formAction, isPending] = useActionState(submitReview, null)

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border p-4 text-center text-sm text-muted-foreground">
        후기를 남기려면{" "}
        <Link href="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
          로그인
        </Link>
        이 필요합니다.
      </div>
    )
  }

  return (
    <form action={formAction} className="rounded-xl border p-4 space-y-3">
      <input type="hidden" name="cityId" value={cityId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <p className="text-sm font-medium mb-1.5">별점</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-xl transition-opacity ${n <= rating ? "opacity-100" : "opacity-30"}`}
              aria-label={`${n}점`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      <textarea
        name="content"
        placeholder="노마드로서의 경험을 공유해주세요... (10자 이상)"
        required
        minLength={10}
        rows={3}
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
      />

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">후기가 등록되었습니다!</p>}

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "등록 중..." : "후기 등록"}
      </Button>
    </form>
  )
}
