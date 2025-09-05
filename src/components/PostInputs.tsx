"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, X, Upload, ImageIcon } from "lucide-react"

export default function PostInputs() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("0")
  const [customId, setCustomId] = useState<string | null>(null)
  const [inventoryId, setInventoryId] = useState<number | null>(null)
  const [inventories, setInventories] = useState<{ id: number; title: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

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

  // Upload image to Supabase via API route
  async function uploadImage(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      return data.url as string
    } catch (err) {
      console.error("Image upload failed:", err)
      return null
    }
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !description || !inventoryId) return

    setIsLoading(true)

    try {
      let uploadedImageUrl: string | null = null
      if (image) {
        uploadedImageUrl = await uploadImage(image)
      }

      const res = await fetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          quantity: Number(quantity),
          inventoryId,
          category,
          imageUrl: uploadedImageUrl,
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
        setImage(null)
        setImageUrl(null)
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
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {showSuccessToast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50 bg-background text-foreground px-4 sm:px-6 py-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Item Created!</p>
              <p className="text-sm text-muted-foreground">Your item has been added successfully</p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="flex-shrink-0 hover:bg-muted rounded-lg p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Card className="shadow-lg border">
        <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-xl sm:text-2xl font-bold">Create New Item</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Add a new product to your inventory with all the necessary details
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={createProduct} className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Item Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-10 sm:h-11"
                  placeholder="Enter item name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Category
                </Label>
                <Input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 sm:h-11"
                  placeholder="e.g., Electronics, Clothing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                className="resize-none min-h-[80px] sm:min-h-[100px]"
                placeholder="Provide a detailed description of the item"
              />
            </div>

            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                  className="h-10 sm:h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventory" className="text-sm font-semibold">
                  Assign to Inventory *
                </Label>
                <Select
                  value={inventoryId?.toString() || ""}
                  onValueChange={(value) => setInventoryId(Number(value))}
                  required
                >
                  <SelectTrigger className="h-10 sm:h-11">
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
            </div>

            <div className="space-y-3">
              <Label htmlFor="image" className="text-sm font-semibold">
                Upload Image
              </Label>
              <div className="border-2 border-dashed rounded-xl p-4 sm:p-6 hover:border-muted-foreground/50 transition-colors relative">
                <div className="flex flex-col items-center justify-center space-y-3">
                  {image ? (
                    <div className="flex items-center space-x-3 w-full">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{image.name}</p>
                        <p className="text-xs text-muted-foreground">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setImage(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setImage(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || !name || !description || !inventoryId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Creating Item...
                  </>
                ) : (
                  "Create Item"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
