import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
        <span>🇰🇷</span>
        <span>노마드코리아</span>
      </Link>

      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-lg">이메일을 확인해주세요</CardTitle>
          <CardDescription>
            가입하신 이메일로 확인 링크를 보내드렸습니다.
            링크를 클릭하면 가입이 완료됩니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-4xl py-2">
          ✉️
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          이미 확인하셨나요?&nbsp;
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
