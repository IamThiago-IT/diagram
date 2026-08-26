"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const localeConfig: Record<string, { label: string; flag: string }> = {
  "pt-BR": { label: "Português", flag: "BR" },
  en: { label: "English", flag: "EN" },
  fr: { label: "Français", flag: "FR" },
  ja: { label: "日本語", flag: "JP" },
  es: { label: "Español", flag: "ES" },
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
    setOpen(false)
  }

  const current = localeConfig[locale] || localeConfig["pt-BR"]

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="h-8 gap-1.5 text-xs font-medium"
      >
        <Globe className="h-3.5 w-3.5" />
        {current.flag}
        <ChevronDown className="h-3 w-3" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[160px]">
            {Object.entries(localeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => switchLocale(key)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  locale === key
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-popover-foreground hover:bg-accent"
                }`}
              >
                <span className="text-[10px] font-mono text-muted-foreground w-5">
                  {config.flag}
                </span>
                {config.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
