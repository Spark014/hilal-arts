'use client'

import { useState } from 'react'
import { updateOrderStatus, updateOrderTracking } from '../../../actions/admin'
import styles from '../../layout.module.css'

const orderStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function OrderActions({ orderId, currentStatus, trackingNumber: initialTracking }) {
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState('')
  const [tracking, setTracking] = useState(initialTracking || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleStatusUpdate = async () => {
    if (status === currentStatus && !notes) return
    setLoading(true)
    setMessage('')
    
    const result = await updateOrderStatus(orderId, status, notes)
    setLoading(false)
    
    if (result.error) {
      setMessage('Error: ' + result.error)
    } else {
      setMessage('Status updated!')
      setNotes('')
      setTimeout(() => setMessage(''), 3000)
    }
  }
  
  const handleTrackingUpdate = async () => {
    if (!tracking) return
    setLoading(true)
    
    const result = await updateOrderTracking(orderId, tracking)
    setLoading(false)
    
    if (result.error) {
      setMessage('Error: ' + result.error)
    } else {
      setMessage('Tracking number saved!')
      setTimeout(() => setMessage(''), 3000)
    }
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {message && (
        <div className={`${styles.alert} ${message.startsWith('Error') ? styles.alertError : styles.alertSuccess}`}>
          {message}
        </div>
      )}
      
      <div>
        <label className={styles.formLabel}>Update Status</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={styles.formSelect}
            style={{ flex: 1 }}
          >
            {orderStatuses.map(s => (
              <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className={styles.formLabel}>Notes (optional)</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={styles.formInput}
          placeholder="Add a note about this status change..."
          style={{ marginTop: '6px' }}
        />
      </div>
      
      <button
        onClick={handleStatusUpdate}
        disabled={loading}
        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
        style={{ alignSelf: 'flex-start' }}
      >
        {loading ? 'Updating...' : 'Update Status'}
      </button>
      
      <div style={{ borderTop: '1px solid rgba(93,26,31,0.08)', paddingTop: '16px', marginTop: '4px' }}>
        <label className={styles.formLabel}>Tracking Number</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className={styles.formInput}
            placeholder="Enter tracking number..."
            style={{ flex: 1 }}
          />
          <button
            onClick={handleTrackingUpdate}
            disabled={loading}
            className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
