"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

const localeLabels: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const newLocale = locale === "pt-BR" ? "en" : "pt-BR"
    const segments = pathname.split("/")
    segments[1] = newLocale
    router.push(segments.join("/"))
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="h-8 gap-1.5 text-xs font-medium"
      title={locale === "pt-BR" ? "Switch to English" : "Mudar para Português"}
    >
      <Globe className="h-3.5 w-3.5" />
      {localeLabels[locale] || "PT"}
    </Button>
  )
}
