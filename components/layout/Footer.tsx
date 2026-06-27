import { Separator } from "@/components/ui/separator"
import { MessageCircle } from "lucide-react"

const footerLinks = [
  { label: "소개", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <span>🇰🇷</span>
            <span>노마드코리아</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Separator orientation="vertical" className="h-4 hidden md:block" />
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              채팅 참여
            </a>
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 노마드코리아. 한국 디지털 노마드 커뮤니티를 위해 만들었습니다.
        </div>
      </div>
    </footer>
  )
}
