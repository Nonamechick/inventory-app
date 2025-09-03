"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Inventory, Product } from "@/lib/inventory"
import { ArrowLeft, Edit3, Trash2, Package, Save, X } from "lucide-react"

export default function InventoryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [inventory, setInventory] = useState<Inventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    async function fetchInventory() {
      const res = await fetch("/inventory")
      if (res.ok) {
        const data: Inventory[] = await res.json()
        const found = data.find((inv) => inv.id.toString() === id)
        if (found) {
          setInventory(found)
          setTitle(found.title)
          setDescription(found.description)
        }
      }
      setLoading(false)
    }
    fetchInventory()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded-lg w-1/3 mb-6"></div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-8"></div>
              <div className="flex gap-3 mb-8">
                <div className="h-10 bg-muted rounded-lg w-20"></div>
                <div className="h-10 bg-muted rounded-lg w-20"></div>
              </div>
              <div className="space-y-4">
                <div className="h-20 bg-muted rounded-xl"></div>
                <div className="h-20 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!inventory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="p-2 bg-primary/10 rounded-lg inline-flex mb-4">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Inventory Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The inventory you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/inventories")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventories
          </button>
        </div>
      </div>
    )
  }

  // DELETE
  async function handleDelete() {
    if (!inventory) return
    if (!confirm("Are you sure you want to delete this inventory?")) return

    setActionLoading(true)
    const res = await fetch("/inventory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inventory.id }),
    })
    setActionLoading(false)

    if (res.ok) {
      alert("Inventory deleted")
      router.push("/inventories")
    } else {
      const text = await res.text()
      alert("Failed to delete inventory: " + text)
    }
  }

  // UPDATE
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!inventory) return
    setActionLoading(true)

    const res = await fetch("/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: inventory.id, title, description }),
    })

    setActionLoading(false)
    if (res.ok) {
      const updated = await res.json()
      setInventory({ ...inventory, ...updated })
      setEditing(false)
      alert("Inventory updated")
    } else {
      const text = await res.text()
      alert("Failed to update inventory: " + text)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => router.push("/inventories")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventories
          </button>

          {!editing && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">{inventory.title}</h1>
              </div>
              <p className="text-muted-foreground mb-6">{inventory.description}</p>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          {editing ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Edit3 className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Edit Inventory</h2>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Inventory Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-background"
                    placeholder="Enter inventory title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-colors resize-none bg-background"
                    rows={4}
                    placeholder="Enter inventory description"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {actionLoading ? "Updating..." : "Update Inventory"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Items</h2>
                  <p className="text-sm text-muted-foreground">
                    {inventory.products?.length ?? 0} items in inventory
                  </p>
                </div>
              </div>

              {inventory.products && inventory.products.length > 0 ? (
                <div className="space-y-4">
                  {inventory.products.map((prod: Product) => (
                    <div
                      key={prod.id}
                      className="bg-muted/50 rounded-lg p-4 border border-border hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{prod.name}</h3>
                          <p className="text-muted-foreground mb-3 leading-relaxed">{prod.description}</p>
                        </div>
                        <div className="ml-4">
                          <div className="bg-background px-3 py-1 rounded-full border border-border">
                            <span className="text-sm font-medium text-foreground">Qty: {prod.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-2 bg-primary/10 rounded-lg inline-flex mb-4">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Items Yet</h3>
                  <p className="text-muted-foreground">
                    This inventory doesn&apos;t have any items added yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
