"use client"

import Link from "next/link"
import { ChevronDown, Plus, Package, Indent as Inventory } from "lucide-react"
import { useState } from "react"

export function CreateDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-20">
            <div className="py-1">
              <Link
                href="/create-inventory"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Inventory className="h-4 w-4" />
                Create Inventory
              </Link>
              <Link
                href="/create-product"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Package className="h-4 w-4" />
                Create Item
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
