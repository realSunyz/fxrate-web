"use client"

import * as React from "react"
import { Icons } from "@/components/icons"
// import { ModeSwitcher } from "@/components/mode-switcher"

export function NavBar() {
    return (
        <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex h-14 items-center justify-center">
                    <Icons.logo className="h-7" />
                </div>
            </div>
        </header>
    )
}