'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toggleProductField, deleteProduct } from '../../actions/admin'
import styles from '../layout.module.css'

export default function ProductsTable({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.arabic_name && p.arabic_name.includes(search)) ||
    (p.script && p.script.toLowerCase().includes(search.toLowerCase()))
  )
  
  const handleToggle = async (id, field, currentValue) => {
    // Optimistic update
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: !currentValue } : p
    ))
    
    const result = await toggleProductField(id, field, !currentValue)
    if (result.error) {
      // Revert on error
      setProducts(prev => prev.map(p =>
        p.id === id ? { ...p, [field]: currentValue } : p
      ))
      alert('Error: ' + result.error)
    }
  }
  
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    
    const result = await deleteProduct(id)
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }
  
  return (
    <>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.formInput}
          style={{ width: '240px', padding: '8px 12px', fontSize: '0.9rem' }}
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Collection</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Featured</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr key={product.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {(product.image_url || product.image) && (
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '4px', overflow: 'hidden',
                      border: '1px solid rgba(93,26,31,0.1)',
                      flexShrink: 0,
                    }}>
                      <img
                        src={product.image_url || product.image}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--burgundy-deep)' }}>{product.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--cream-dark)' }}>{product.slug}</div>
                  </div>
                </div>
              </td>
              <td>{product.collection?.name || '—'}</td>
              <td style={{ fontWeight: 600 }}>${product.price}</td>
              <td>{product.stock_quantity}</td>
              <td>
                <button
                  className={`${styles.toggle} ${product.is_featured ? styles.active : ''}`}
                  onClick={() => handleToggle(product.id, 'is_featured', product.is_featured)}
                  aria-label={product.is_featured ? 'Unfeature' : 'Feature'}
                >
                  <span className={styles.toggleKnob}></span>
                </button>
              </td>
              <td>
                <button
                  className={`${styles.toggle} ${product.is_active ? styles.active : ''}`}
                  onClick={() => handleToggle(product.id, 'is_active', product.is_active)}
                  aria-label={product.is_active ? 'Deactivate' : 'Activate'}
                >
                  <span className={styles.toggleKnob}></span>
                </button>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className={styles.btnIcon}
                    title="Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                  <button
                    className={styles.btnIcon}
                    onClick={() => handleDelete(product.id, product.name)}
                    title="Delete"
                    style={{ color: '#dc2626' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
