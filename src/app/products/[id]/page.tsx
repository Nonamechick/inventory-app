import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "./ProductForm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const productId = Number(id)

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: isNaN(Number(id)) ? undefined : Number(id) }, { customId: id }],
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  })

  if (!product) return notFound()

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground text-balance">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      ID: {product.customId}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Qty: {product.quantity}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {product.description && (
          <Card className="mb-8 bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-3">Product Description</h2>
              <p className="text-foreground leading-relaxed text-pretty">{product.description}</p>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        <ProductForm
          product={{
            ...product,
            description: product.description || "",
          }}
        />
      </main>
    </div>
  )
}
