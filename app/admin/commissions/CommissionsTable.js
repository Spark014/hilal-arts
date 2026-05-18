'use client'

import { useState } from 'react'
import { updateCommissionStatus } from '../../actions/admin'
import styles from '../layout.module.css'

const commissionStatuses = ['new', 'contacted', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled']

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function statusBadge(status) {
  const map = {
    new: styles.badgeYellow,
    contacted: styles.badgeBlue,
    quoted: styles.badgePurple,
    accepted: styles.badgeGreen,
    in_progress: styles.badgeBlue,
    completed: styles.badgeGreen,
    cancelled: styles.badgeRed,
  }
  return `${styles.badge} ${map[status] || styles.badgeGray}`
}

export default function CommissionsTable({ commissions: initial }) {
  const [commissions, setCommissions] = useState(initial)
  const [expandedId, setExpandedId] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleStatusChange = async (id, newStatus) => {
    setLoading(true)
    const result = await updateCommissionStatus(id, newStatus, undefined)
    setLoading(false)
    
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      setCommissions(prev => prev.map(c =>
        c.id === id ? { ...c, status: newStatus } : c
      ))
    }
  }
  
  const handleSaveNotes = async (id) => {
    setLoading(true)
    const commission = commissions.find(c => c.id === id)
    const result = await updateCommissionStatus(id, commission.status, adminNotes)
    setLoading(false)
    
    if (result.error) {
      alert('Error: ' + result.error)
    } else {
      setCommissions(prev => prev.map(c =>
        c.id === id ? { ...c, admin_notes: adminNotes } : c
      ))
      setExpandedId(null)
    }
  }
  
  return (
    <>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{commissions.length} commission{commissions.length !== 1 ? 's' : ''}</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Verse</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((c) => (
            <>
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>
                  <div>{c.email}</div>
                  {c.phone && <div style={{ fontSize: '0.82rem', color: 'var(--cream-dark)' }}>{c.phone}</div>}
                </td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.desired_verse || '—'}
                </td>
                <td>{c.budget_range || '—'}</td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className={styles.formSelect}
                    style={{ padding: '4px 8px', fontSize: '0.82rem', minWidth: '120px' }}
                    disabled={loading}
                  >
                    {commissionStatuses.map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{formatDate(c.created_at)}</td>
                <td>
                  <button
                    className={styles.btnIcon}
                    onClick={() => {
                      setExpandedId(expandedId === c.id ? null : c.id)
                      setAdminNotes(c.admin_notes || '')
                    }}
                    title="View details"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={expandedId === c.id ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
                    </svg>
                  </button>
                </td>
              </tr>
              {expandedId === c.id && (
                <tr key={`${c.id}-detail`}>
                  <td colSpan="7" style={{ background: '#faf8f5', padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      {c.message && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--cream-dark)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Message</strong>
                          <p style={{ marginTop: '4px', lineHeight: 1.6 }}>{c.message}</p>
                        </div>
                      )}
                      {c.dimensions && (
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--cream-dark)' }}>DIMENSIONS</strong>
                          <p style={{ marginTop: '4px' }}>{c.dimensions}</p>
                        </div>
                      )}
                      {c.script_preference && (
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--cream-dark)' }}>SCRIPT</strong>
                          <p style={{ marginTop: '4px' }}>{c.script_preference}</p>
                        </div>
                      )}
                      {c.color_preference && (
                        <div>
                          <strong style={{ fontSize: '0.82rem', color: 'var(--cream-dark)' }}>COLORS</strong>
                          <p style={{ marginTop: '4px' }}>{c.color_preference}</p>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(93,26,31,0.08)', paddingTop: '16px' }}>
                      <label className={styles.formLabel}>Admin Notes</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className={styles.formTextarea}
                          style={{ flex: 1, minHeight: '60px' }}
                          placeholder="Add internal notes about this commission..."
                        />
                      </div>
                      <button
                        onClick={() => handleSaveNotes(c.id)}
                        disabled={loading}
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                        style={{ marginTop: '8px' }}
                      >
                        Save Notes
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </>
  )
}
