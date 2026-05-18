'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCollection, updateCollection } from '../../actions/admin'
import styles from '../layout.module.css'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function CollectionForm({ collection }) {
  const router = useRouter()
  const isEdit = !!collection
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [name, setName] = useState(collection?.name || '')
  const [slug, setSlug] = useState(collection?.slug || '')
  const [arabicName, setArabicName] = useState(collection?.arabic_name || '')
  const [description, setDescription] = useState(collection?.description || '')
  const [image, setImage] = useState(collection?.image || '')
  const [sortOrder, setSortOrder] = useState(collection?.sort_order || 0)
  const [isActive, setIsActive] = useState(collection?.is_active !== false)
  
  const handleNameChange = (val) => {
    setName(val)
    if (!isEdit || slug === slugify(name)) {
      setSlug(slugify(val))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    const formData = new FormData()
    formData.set('name', name)
    formData.set('slug', slug)
    formData.set('arabic_name', arabicName)
    formData.set('description', description)
    formData.set('image', image)
    formData.set('sort_order', sortOrder.toString())
    formData.set('is_active', isActive.toString())
    
    const result = isEdit
      ? await updateCollection(collection.id, formData)
      : await createCollection(formData)
    
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(isEdit ? 'Collection updated!' : 'Collection created!')
      if (!isEdit) {
        setTimeout(() => router.push('/admin/collections'), 1200)
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
      {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}
      
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Collection Details</div>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={styles.formInput}
              required
              placeholder="Quranic Verses"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={styles.formInput}
              placeholder="quranic-verses"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Arabic Name</label>
            <input
              type="text"
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
              className={styles.formInput}
              placeholder="الآيات القرآنية"
              dir="rtl"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className={styles.formInput}
              min="0"
            />
          </div>
          <div className={`${styles.formGroup} ${styles.formFull}`}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.formTextarea}
              placeholder="Describe this collection..."
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cover Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={styles.formInput}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
          <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <label className={styles.formCheckLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active (visible on store)
            </label>
          </div>
        </div>
      </div>
      
      <div className={styles.formActions}>
        <button
          type="submit"
          disabled={loading}
          className={`${styles.btn} ${styles.btnPrimary}`}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Collection' : 'Create Collection')}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/collections')}
          className={`${styles.btn} ${styles.btnSecondary}`}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
