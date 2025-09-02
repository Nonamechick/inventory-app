export interface Inventory {
  id: string
  title: string
  description: string
  products?: Product[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Product {
  id: string
  name: string
  description?: string
  quantity: number
  price?: number
  sku?: string
  inventoryId: string
  createdAt?: Date
  updatedAt?: Date
}
