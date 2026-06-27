"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

type ActionState = { error: string } | null

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." }
  }

  redirect("/")
}

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/auth/verify-email")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
