"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { login } from "@/app/auth/actions"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
        <span>🇰🇷</span>
        <span>노마드코리아</span>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg text-center">로그인</CardTitle>
          <CardDescription className="text-center">
            계정에 로그인하여 노마드 정보를 이용하세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <Button type="submit" className="w-full mt-1" disabled={isPending}>
              {isPending ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          아직 계정이 없으신가요?&nbsp;
          <Link
            href="/register"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            회원가입
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
