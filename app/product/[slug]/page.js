import { getProductBySlug } from '../../../lib/services/products'
import { getProducts } from '../../../lib/services/products'
import ProductClient from './ProductClient'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export default async function ProductPage({ params }) {
  const { slug } = params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    notFound()
  }
  
  // Get related products from same collection
  const allProducts = await getProducts()
  const related = allProducts
    .filter(p => p.collection_id === product.collection_id && p.id !== product.id)
    .slice(0, 4)
  
  return <ProductClient product={product} related={related} />
}