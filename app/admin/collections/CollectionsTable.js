'use client'

import Link from 'next/link'
import { useState } from 'react'
import { deleteCollection } from '../../actions/admin'
import styles from '../layout.module.css'

export default function CollectionsTable({ collections: initial }) {
  const [collections, setCollections] = useState(initial)
  
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete collection "${name}"? Products in this collection will become uncategorized.`)) return
    
    const result = await deleteCollection(id)
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      setCollections(prev => prev.filter(c => c.id !== id))
    }
  }
  
  return (
    <>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{collections.length} collection{collections.length !== 1 ? 's' : ''}</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Arabic</th>
            <th>Slug</th>
            <th>Sort Order</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id}>
              <td style={{ fontWeight: 600, color: 'var(--burgundy-deep)' }}>{c.name}</td>
              <td style={{ fontFamily: 'var(--font-amiri), serif', direction: 'rtl' }}>{c.arabic_name || '—'}</td>
              <td style={{ fontSize: '0.85rem', color: 'var(--cream-dark)' }}>{c.slug}</td>
              <td>{c.sort_order}</td>
              <td>
                <span className={`${styles.badge} ${c.is_active ? styles.badgeGreen : styles.badgeRed}`}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link href={`/admin/collections/${c.id}/edit`} className={styles.btnIcon} title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>
                  <button
                    className={styles.btnIcon}
                    onClick={() => handleDelete(c.id, c.name)}
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
