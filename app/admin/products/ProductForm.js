'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '../../actions/admin'
import styles from '../layout.module.css'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function ProductForm({ product, collections }) {
  const router = useRouter()
  const isEdit = !!product
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form state
  const [name, setName] = useState(product?.name || '')
  const [slug, setSlug] = useState(product?.slug || '')
  const [arabicName, setArabicName] = useState(product?.arabic_name || '')
  const [collectionId, setCollectionId] = useState(product?.collection_id || '')
  const [script, setScript] = useState(product?.script || '')
  const [dimensions, setDimensions] = useState(product?.dimensions || '')
  const [canvasSize, setCanvasSize] = useState(product?.canvas_size || 'medium')
  const [price, setPrice] = useState(product?.price || '')
  const [customizationFee, setCustomizationFee] = useState(product?.customization_fee || 0)
  const [processingTime, setProcessingTime] = useState(product?.processing_time || '')
  const [description, setDescription] = useState(product?.description || '')
  const [calligrapher, setCalligrapher] = useState(product?.calligrapher || '')
  const [imageUrl, setImageUrl] = useState(product?.image_url || product?.image || '')
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false)
  const [isActive, setIsActive] = useState(product?.is_active !== false)
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity || 1)
  
  // Features
  const [features, setFeatures] = useState(
    product?.product_features?.map(f => f.text) || []
  )
  const [newFeature, setNewFeature] = useState('')
  
  // Customizations
  const [customizations, setCustomizations] = useState(
    product?.product_customizations?.map(c => c.label) || []
  )
  const [newCustomization, setNewCustomization] = useState('')
  
  // Images
  const [images, setImages] = useState(
    product?.product_images?.map(img => img.url) || []
  )
  const [newImageUrl, setNewImageUrl] = useState('')
  
  const handleNameChange = (val) => {
    setName(val)
    if (!isEdit || slug === slugify(name)) {
      setSlug(slugify(val))
    }
  }
  
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }
  
  const addCustomization = () => {
    if (newCustomization.trim()) {
      setCustomizations([...customizations, newCustomization.trim()])
      setNewCustomization('')
    }
  }
  
  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()])
      setNewImageUrl('')
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
    formData.set('collection_id', collectionId)
    formData.set('script', script)
    formData.set('dimensions', dimensions)
    formData.set('canvas_size', canvasSize)
    formData.set('price', price.toString())
    formData.set('customization_fee', customizationFee.toString())
    formData.set('processing_time', processingTime)
    formData.set('description', description)
    formData.set('calligrapher', calligrapher)
    formData.set('image_url', imageUrl)
    formData.set('is_featured', isFeatured.toString())
    formData.set('is_active', isActive.toString())
    formData.set('stock_quantity', stockQuantity.toString())
    formData.set('features', JSON.stringify(features))
    formData.set('customizations', JSON.stringify(customizations))
    formData.set('images', JSON.stringify(images))
    
    const result = isEdit
      ? await updateProduct(product.id, formData)
      : await createProduct(formData)
    
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(isEdit ? 'Product updated successfully!' : 'Product created successfully!')
      if (!isEdit) {
        setTimeout(() => router.push('/admin/products'), 1200)
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}</div>}
      {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}
      
      {/* Basic Info */}
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Basic Information</div>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={styles.formInput}
              required
              placeholder="Ayat al-Kursi — Teal & Gold"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={styles.formInput}
              placeholder="ayat-al-kursi-teal"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Arabic Name</label>
            <input
              type="text"
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
              className={styles.formInput}
              placeholder="آية الكرسي"
              dir="rtl"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Collection</label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className={styles.formSelect}
            >
              <option value="">— No Collection —</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={`${styles.formGroup} ${styles.formFull}`}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.formTextarea}
              placeholder="Describe the calligraphy piece..."
              rows={4}
            />
          </div>
        </div>
      </div>
      
      {/* Details */}
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Details</div>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Script Style</label>
            <input
              type="text"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className={styles.formInput}
              placeholder="Thuluth"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Dimensions</label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className={styles.formInput}
              placeholder='36" × 24"'
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Canvas Size</label>
            <select
              value={canvasSize}
              onChange={(e) => setCanvasSize(e.target.value)}
              className={styles.formSelect}
            >
              <option value="small">Small (under 10″)</option>
              <option value="medium">Medium (10–30″)</option>
              <option value="large">Large (30–50″)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Calligrapher</label>
            <input
              type="text"
              value={calligrapher}
              onChange={(e) => setCalligrapher(e.target.value)}
              className={styles.formInput}
              placeholder="Master Ahmed"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Processing Time</label>
            <input
              type="text"
              value={processingTime}
              onChange={(e) => setProcessingTime(e.target.value)}
              className={styles.formInput}
              placeholder="2–3 weeks"
            />
          </div>
        </div>
      </div>
      
      {/* Pricing */}
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Pricing & Stock</div>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Price (USD) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles.formInput}
              required
              min="0"
              placeholder="850"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Customization Fee</label>
            <input
              type="number"
              value={customizationFee}
              onChange={(e) => setCustomizationFee(parseInt(e.target.value) || 0)}
              className={styles.formInput}
              min="0"
              placeholder="150"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
              className={styles.formInput}
              min="0"
              placeholder="1"
            />
          </div>
          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '12px' }}>
            <label className={styles.formCheckLabel}>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured Product
            </label>
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
      
      {/* Images */}
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Images</div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Primary Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={styles.formInput}
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && (
            <div style={{ marginTop: '8px', width: '120px', height: '120px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(93,26,31,0.1)' }}>
              <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        
        <div className={styles.formGroup} style={{ marginTop: '16px' }}>
          <label className={styles.formLabel}>Additional Images</label>
          <div className={styles.chipInput}>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className={styles.formInput}
              placeholder="Image URL"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            />
            <button type="button" onClick={addImage} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}>Add</button>
          </div>
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {images.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(93,26,31,0.1)' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    style={{
                      position: 'absolute', top: '2px', right: '2px',
                      width: '18px', height: '18px',
                      background: 'rgba(0,0,0,0.6)', color: 'white',
                      border: 'none', borderRadius: '50%',
                      cursor: 'pointer', fontSize: '0.7rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Features */}
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Features</div>
        <div className={styles.chipInput}>
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className={styles.formInput}
            placeholder="e.g. Hand-applied 23K gold leaf"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
          />
          <button type="button" onClick={addFeature} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}>Add</button>
        </div>
        {features.length > 0 && (
          <div className={styles.chipList}>
            {features.map((f, i) => (
              <span key={i} className={styles.chip}>
                {f}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                >×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Customizations */}
      <div className={styles.formCard}>
        <div className={styles.formCardTitle}>Customization Options</div>
        <div className={styles.chipInput}>
          <input
            type="text"
            value={newCustomization}
            onChange={(e) => setNewCustomization(e.target.value)}
            className={styles.formInput}
            placeholder="e.g. Custom verse selection"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomization())}
          />
          <button type="button" onClick={addCustomization} className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}>Add</button>
        </div>
        {customizations.length > 0 && (
          <div className={styles.chipList}>
            {customizations.map((c, i) => (
              <span key={i} className={styles.chip}>
                {c}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={() => setCustomizations(customizations.filter((_, j) => j !== i))}
                >×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Submit */}
      <div className={styles.formActions}>
        <button
          type="submit"
          disabled={loading}
          className={`${styles.btn} ${styles.btnPrimary}`}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className={`${styles.btn} ${styles.btnSecondary}`}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
