import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { ProductsDataTable } from "@/components/products-data-table"

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) return <div className="flex justify-center">Sign in to create Product</div>

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, email: true, name: true },
      },
    },
  })

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products Dashboard</h1>
          <p className="text-muted-foreground">Manage and view all your products in one place</p>
        </div>
        <Link href="/create-product">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Create New Product
          </button>
        </Link>
      </div>

      <ProductsDataTable data={products} />
    </main>
  )
}
