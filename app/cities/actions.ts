"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

type ActionState = { error?: string; success?: boolean } | null

export async function submitReview(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "로그인이 필요합니다." }

  const cityId = formData.get("cityId") as string
  const rating = parseInt(formData.get("rating") as string, 10)
  const content = (formData.get("content") as string).trim()

  if (!content || content.length < 10) {
    return { error: "후기를 10자 이상 입력해주세요." }
  }

  const author = (user.user_metadata?.name as string | undefined) ?? user.email ?? "익명"

  const { error } = await supabase.from("reviews").insert({
    city_id: cityId,
    user_id: user.id,
    author,
    rating,
    content,
  })

  if (error) return { error: "후기 등록에 실패했습니다." }

  revalidatePath(`/cities/${cityId}`)
  return { success: true }
}
