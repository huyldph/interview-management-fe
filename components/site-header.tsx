"use client"

import Link from "next/link"
import { useTitle } from "@/contexts/TitleContext"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    const { title } = useTitle()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-[#fafaf8] backdrop-blur">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                    <span className="p-4">{title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-right">
                        <div>hoamk</div>
                        <div className="text-muted-foreground">HR Department</div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/logout">Logout</Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}

