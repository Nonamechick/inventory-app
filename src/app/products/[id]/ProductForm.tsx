"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/components/products-data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, User, Hash, Package, Trash2, Loader2, Save } from "lucide-react"

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

  const handleUpdate = async () => {
    setLoading(true)
    toast.loading("Updating product...", { id: "update-product" })

    try {
      const response = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          name,
          description,
          quantity: quantity === "" ? 0 : Number(quantity),
          customId,
        }),
      })

      if (response.ok) {
        toast.success(`Product "${name}" updated successfully!`, { id: "update-product" })
        router.refresh()
      } else {
        throw new Error("Failed to update product")
      }
    } catch (error) {
      toast.error("Failed to update product. Please try again.", { id: "update-product" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    toast.loading("Deleting product...", { id: "delete-product" })

    try {
      const response = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      })

      if (response.ok) {
        toast.success(`Product "${name}" deleted successfully!`, { id: "delete-product" })
        router.push("/dashboard")
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      toast.error("Failed to delete product. Please try again.", { id: "delete-product" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Product ID</p>
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

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-card-foreground">Edit Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Product Name
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

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Product"}
            </Button>

            <Button onClick={handleDelete} disabled={loading} variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Product"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
