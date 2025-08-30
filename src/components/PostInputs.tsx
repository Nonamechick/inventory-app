"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2, X } from "lucide-react"

export default function PostInputs() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("0")
  const [customId, setCustomId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  async function createProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !description) return

    setIsLoading(true)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          quantity: quantity === "" ? 0 : Number(quantity),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setCustomId(data.customId)
        setShowSuccessToast(true)
        setName("")
        setDescription("")
        setQuantity("0")
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
      const timer = setTimeout(() => {
        setShowSuccessToast(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessToast])

  return (
    <div className="space-y-6">
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Product Created!</p>
              <p className="text-sm opacity-90">Your product has been added successfully</p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-2 hover:bg-green-700 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={createProduct} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your product"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !name || !description}>
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

      {customId && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-in fade-in-50 duration-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">Product created successfully!</p>
              <p className="text-green-700 dark:text-green-300 text-sm font-mono">
                Product ID: <strong>{customId}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
