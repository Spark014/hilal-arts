import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

/**
 * GET /api/order-status?session_id=cs_xxx
 * 
 * Used by the order success page to poll for webhook completion.
 * Returns order status and basic details without requiring auth
 * (since the user just came back from Stripe Checkout).
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId || !sessionId.match(/^cs_(test|live)_[a-zA-Z0-9]+$/)) {
    return NextResponse.json(
      { error: 'Invalid session ID' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, status, total, shipping_name, customer_name, created_at')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) {
    // PGRST116 = no rows found
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    console.error('Order status query error:', error)
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }

  return NextResponse.json(order)
}
