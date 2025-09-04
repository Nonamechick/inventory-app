"use client"

import { useState } from "react"
import { ProductsDataTable } from "@/components/products-data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Inventory = {
  id: number
  title: string
  description: string | null
  products: Array<{
    id: number
    customId: string
    name: string
    description: string | null
    quantity: number
    category: string | null 
    createdAt: Date
    inventoryId: number
    author: {
      id: number
      email: string
      name: string | null
    } | null
  }>
}

interface InventorySelectorProps {
  inventories: Inventory[]
}

export function InventorySelector({ inventories }: InventorySelectorProps) {
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("")

  const selectedInventory = inventories.find((inv) => inv.id.toString() === selectedInventoryId)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label htmlFor="inventory-select" className="text-sm font-medium whitespace-nowrap">
          Select Inventory:
        </label>
        <Select value={selectedInventoryId} onValueChange={setSelectedInventoryId}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Choose an inventory to view items" />
          </SelectTrigger>
          <SelectContent>
            {inventories.map((inventory) => (
              <SelectItem key={inventory.id} value={inventory.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{inventory.title}</span>
                  {inventory.description && (
                    <span className="text-xs text-muted-foreground">{inventory.description}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedInventory && (
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-3 sm:pl-4">
            <h2 className="text-xl sm:text-2xl font-semibold">{selectedInventory.title}</h2>
            {selectedInventory.description && (
              <p className="text-muted-foreground text-sm sm:text-base">{selectedInventory.description}</p>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {selectedInventory.products.length} product{selectedInventory.products.length !== 1 ? "s" : ""}
            </p>
          </div>

          <ProductsDataTable data={selectedInventory.products} />
        </div>
      )}

      {selectedInventoryId && !selectedInventory && (
        <p className="text-muted-foreground text-sm sm:text-base">Selected inventory not found.</p>
      )}
    </div>
  )
}
