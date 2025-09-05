"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/components/products-data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, User, Hash, Package, Trash2, Loader2, Save, X, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ProductFormProps {
  product: Product
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(product.quantity.toString())
  const [customId, setCustomId] = useState(product.customId)
  const [category, setCategory] = useState(product.category ?? "")
  const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "")
  const [uploading, setUploading] = useState(false)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpdate = async () => {
    setLoading(true)
    toast.loading("Updating item...", { id: "update-product" })

    try {
      const response = await fetch("/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name,
          description,
          quantity: quantity === "" ? 0 : Number(quantity),
          customId,
          category,
          imageUrl,
        }),
      })

      if (response.ok) {
        toast.success(`Item "${name}" updated successfully!`, { id: "update-product" })
        router.refresh()
      } else {
        throw new Error("Failed to update item")
      }
    } catch (error) {
      toast.error("Failed to update item. Please try again.", { id: "update-product" })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    toast.loading("Uploading image...", { id: "upload-image" })

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Image upload failed")

      const data = await res.json()
      setImageUrl(data.url) // update state
      toast.success("Image uploaded successfully!", { id: "upload-image" })
    } catch (err) {
      toast.error("Failed to upload image", { id: "upload-image" })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    toast.loading("Deleting item...", { id: "delete-product" })

    try {
      const response = await fetch("/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      })

      if (response.ok) {
        toast.success(`Item "${name}" deleted successfully!`, { id: "delete-product" })
        router.push("/dashboard")
      } else {
        throw new Error("Failed to delete item")
      }
    } catch (error) {
      toast.error("Failed to delete Item. Please try again.", { id: "delete-product" })
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        handleImageUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      handleImageUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      {isImageFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                setIsImageFullscreen(false)
              }}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Package className="h-5 w-5" />
            Item Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Item ID</p>
                <p className="text-sm text-muted-foreground">{product.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Created</p>
                <p className="text-sm text-muted-foreground">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Author</p>
                <p className="text-sm text-muted-foreground">{product.author?.name || product.author?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {product.imageUrl && (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Package className="h-5 w-5" />
              Current Product Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="group relative w-72 h-72 rounded-xl overflow-hidden border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setIsImageFullscreen(true)}
            >
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                  <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                  <Package className="h-4 w-4 text-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">Edit Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Item Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border focus:ring-ring"
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customId" className="text-sm font-medium text-foreground">
                Custom ID
              </Label>
              <Input
                id="customId"
                value={customId}
                onChange={(e) => setCustomId(e.target.value.toUpperCase())}
                className="bg-input border-border focus:ring-ring"
                placeholder="Enter custom ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-input border-border focus:ring-ring max-w-xs"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-input border-border focus:ring-ring max-w-xs"
              placeholder="e.g. Electronics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border focus:ring-ring min-h-[120px]"
              placeholder="Enter product description"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-sm font-medium text-foreground">Product Image</Label>

            {imageUrl && (
              <div
                className="group relative w-64 h-64 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => setIsImageFullscreen(true)}
              >
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                    <Package className="h-3 w-3 text-foreground" />
                  </div>
                </div>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-xl p-4 sm:p-6 transition-colors relative ${
                isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                {selectedFile ? (
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
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
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading image...
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Item"}
            </Button>

            <Button onClick={handleDelete} disabled={loading} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Item"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
