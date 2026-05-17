'use server'

import { createClient } from '@/lib/supabase-server'

/**
 * Commission Inquiry Server Action
 * No authentication required — anyone can submit.
 * Includes basic validation and rate-limiting via Supabase RLS.
 */

export async function submitCommission(formData) {
  const supabase = await createClient()

  // ── Extract and sanitize fields ─────────────────────────────
  const name = (formData.get('name') || '').toString().trim()
  const email = (formData.get('email') || '').toString().trim()
  const phone = (formData.get('phone') || '').toString().trim()
  const desiredVerse = (formData.get('desiredVerse') || '').toString().trim()
  const message = (formData.get('message') || '').toString().trim()
  const dimensions = (formData.get('dimensions') || '').toString().trim()
  const budgetRange = (formData.get('budgetRange') || '').toString().trim()
  const scriptPreference = (formData.get('scriptPreference') || '').toString().trim()
  const colorPreference = (formData.get('colorPreference') || '').toString().trim()

  // Extract reference image URLs from form data
  const referenceImages = []
  for (let i = 1; i <= 3; i++) {
    const url = formData.get(`referenceImage${i}`)
    if (url) referenceImages.push(url.toString())
  }

  // ── Validation ────────────────────────────────────────────────
  if (!name || name.length > 200) {
    return { error: 'Name is required (max 200 characters)' }
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'A valid email is required' }
  }

  if (message.length > 5000) {
    return { error: 'Message exceeds 5000 characters' }
  }

  // ── Insert into database ────────────────────────────────────
  const { data, error } = await supabase
    .from('commissions')
    .insert({
      name,
      email,
      phone: phone || null,
      desired_verse: desiredVerse || null,
      message: message || null,
      dimensions: dimensions || null,
      budget_range: budgetRange || null,
      script_preference: scriptPreference || null,
      color_preference: colorPreference || null,
      reference_images: referenceImages.length > 0 ? referenceImages : null,
    })
    .select()
    .single()

  if (error) {
    console.error('Commission submission error:', error)
    return { error: 'Failed to submit commission. Please try again.' }
  }

  // ── TODO: Send notification email to admin ─────────────────
  // await sendCommissionNotification(data.id)

  return { success: true, id: data.id }
}
