import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "도시", href: "#" },
  { label: "한달살기", href: "#" },
  { label: "코워킹", href: "#" },
  { label: "밋업", href: "#" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span>🇰🇷</span>
          <span>노마드코리아</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
          >
            <MessageCircle className="h-4 w-4" />
            채팅
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            로그인
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            회원가입
          </Link>
        </div>
      </div>
    </header>
  )
}
