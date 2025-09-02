"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Loader2, X } from "lucide-react"

export default function PostInputs() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("0")
  const [customId, setCustomId] = useState<string | null>(null)
  const [inventoryId, setInventoryId] = useState<number | null>(null)
  const [inventories, setInventories] = useState<{ id: number; title: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

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
    }
    fetchInventories()
  }, [])

  async function createProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !description || !inventoryId) return

    setIsLoading(true)

    try {
      const res = await fetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          quantity: quantity === "" ? 0 : Number(quantity),
          inventoryId,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCustomId(data.customId)
        setShowSuccessToast(true)
        setName("")
        setDescription("")
        setQuantity("0")
        setInventoryId(null)
      } else {
        console.error("Failed to create product", await res.text())
      }
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessToast])

  return (
    <div className="space-y-6">
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Product Created!</p>
              <p className="text-sm opacity-90">Your product has been added successfully</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={createProduct} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inventory">Assign to Inventory</Label>
          <Select
            value={inventoryId?.toString() || ""}
            onValueChange={(value) => setInventoryId(Number(value))}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select inventory" />
            </SelectTrigger>
            <SelectContent>
              {inventories.map((inv) => (
                <SelectItem key={inv.id} value={inv.id.toString()}>
                  {inv.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !name || !description || !inventoryId}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Product...
            </>
          ) : (
            "Create Product"
          )}
        </Button>
      </form>
    </div>
  )
}
