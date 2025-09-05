"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Inventory } from "@/lib/inventory"
import { Package, Plus, ArrowRight } from "lucide-react"

export default function InventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInventories() {
      try {
        const res = await fetch("/inventory")
        if (res.ok) {
          const data = await res.json()
          setInventories(data)
        }
      } catch (err) {
        console.error("Failed to fetch inventories", err)
      }
      setLoading(false)
    }
    fetchInventories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded-md w-48"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card border rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Your Inventories</h1>
          </div>
          <p className="text-muted-foreground">Manage and track all your inventory collections</p>
        </div>

        {inventories.length === 0 && (
          <div className="bg-card border rounded-lg p-12 text-center">
            <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No inventories found</h3>
            <p className="text-muted-foreground mb-6">Get started by creating your first inventory collection</p>
            <Link
              href="/create-inventory"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Inventory
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {inventories.map((inv) => (
            <Link key={inv.id} href={`/inventory/${inv.id}`} className="block group">
              <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200 group-hover:border-primary/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {inv.title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground mb-3 leading-relaxed">{inv.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Package className="h-3.5 w-3.5" />
                        {inv.products?.length ?? 0} items
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
