"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signup } from "@/app/auth/actions"

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signup, null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-10">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
        <span>🇰🇷</span>
        <span>노마드코리아</span>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg text-center">회원가입</CardTitle>
          <CardDescription className="text-center">
            노마드코리아와 함께 한국에서의 노마드 생활을 시작하세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="홍길동"
                autoComplete="name"
                required
              />
            </div>

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
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="8자 이상 입력해주세요"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <Checkbox id="terms" className="mt-0.5" required />
              <Label htmlFor="terms" className="text-sm font-normal leading-snug cursor-pointer">
                <Link href="#" className="underline underline-offset-2 hover:text-primary">
                  이용약관
                </Link>
                {" "}및{" "}
                <Link href="#" className="underline underline-offset-2 hover:text-primary">
                  개인정보처리방침
                </Link>
                에 동의합니다
              </Label>
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <Button type="submit" className="w-full mt-1" disabled={isPending}>
              {isPending ? "처리 중..." : "회원가입"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?&nbsp;
          <Link
            href="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            로그인
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
