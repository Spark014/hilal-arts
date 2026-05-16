'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState('loading'); // loading | pending | paid | error
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setStatus('error');
      return;
    }

    // Validate session ID format (Stripe IDs start with cs_test_ or cs_live_)
    if (!sessionId.match(/^cs_(test|live)_[a-zA-Z0-9]+$/)) {
      setError('Invalid session ID');
      setStatus('error');
      return;
    }

    let attempts = 0;
    const maxAttempts = 15; // 30 seconds total (2s intervals)

    async function checkOrder() {
      try {
        const res = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`);
        if (!res.ok) throw new Error('Failed to fetch order status');

        const data = await res.json();

        if (data.status === 'paid') {
          setOrder(data);
          setStatus('paid');
          return true; // Stop polling
        }

        if (data.status === 'pending') {
          setOrder(data);
          setStatus('pending');
          return false; // Continue polling
        }

        if (data.status === 'cancelled' || data.status === 'refunded') {
          setError('This order has been cancelled or refunded');
          setStatus('error');
          return true;
        }

        return false;
      } catch (err) {
        console.error('Order status check failed:', err);
        return false;
      }
    }

    async function poll() {
      const done = await checkOrder();
      if (done) return;

      attempts++;
      if (attempts >= maxAttempts) {
        setStatus('pending'); // Show "still processing" instead of error
        return;
      }

      setTimeout(poll, 2000);
    }

    poll();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 40px' }}>
        <div style={{
          fontFamily: 'var(--font-amiri), serif',
          fontSize: '2rem',
          color: 'var(--copper, #C17A48)',
          marginBottom: '20px'
        }}>
          جاري التحقق...
        </div>
        <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: '1.2rem', color: 'var(--ink, #1A1A1A)' }}>
          Verifying your order...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 40px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-amiri), serif',
          fontSize: '2rem',
          color: 'var(--burgundy-deep, #5D1A1F)',
          marginBottom: '20px'
        }}>
          عذراً
        </div>
        <h1 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '1.8rem',
          color: 'var(--burgundy-deep, #5D1A1F)',
          marginBottom: '16px'
        }}>
          Order Not Found
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.8 }}>
          {error || 'We could not find your order. If you completed payment, please contact us.'}
        </p>
        <a href="/cart" style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: 'var(--burgundy-deep, #5D1A1F)',
          color: '#fff',
          textDecoration: 'none',
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.85rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          Return to Cart
        </a>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '80px 40px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{
        fontFamily: 'var(--font-amiri), serif',
        fontSize: '3rem',
        color: 'var(--copper, #C17A48)',
        marginBottom: '10px'
      }}>
        شكراً لك
      </div>

      <h1 style={{
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: '2.2rem',
        color: 'var(--burgundy-deep, #5D1A1F)',
        marginBottom: '20px'
      }}>
        Thank You for Your Order
      </h1>

      <p style={{
        fontFamily: 'var(--font-cormorant), serif',
        fontSize: '1.2rem',
        color: 'var(--ink, #1A1A1A)',
        marginBottom: '40px',
        opacity: 0.85
      }}>
        {status === 'paid'
          ? 'Your payment has been confirmed. You will receive a confirmation email shortly with tracking details.'
          : 'Your order is being processed. Payment confirmation is pending — this usually takes a few moments.'
        }
      </p>

      {order && (
        <div style={{
          background: 'var(--cream, #EFEBE4)',
          padding: '30px',
          border: '1px solid var(--gold-pale, rgba(198,163,94,0.2))',
          textAlign: 'left',
          marginBottom: '40px'
        }}>
          <div style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: 'var(--copper, #C17A48)',
            marginBottom: '20px',
            textTransform: 'uppercase'
          }}>
            Order Summary
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ opacity: 0.6 }}>Order ID:</span>{' '}
            <span style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              #{order.id?.slice(0, 8)}
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ opacity: 0.6 }}>Status:</span>{' '}
            <span style={{
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              color: status === 'paid' ? '#2E7D32' : 'var(--copper, #C17A48)'
            }}>
              {status === 'paid' ? 'Payment Confirmed' : 'Processing'}
            </span>
          </div>

          {order.total && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ opacity: 0.6 }}>Total:</span>{' '}
              <span style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                ${(order.total / 100).toFixed(2)}
              </span>
            </div>
          )}

          {order.shipping_name && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ opacity: 0.6 }}>Shipping to:</span>{' '}
              {order.shipping_name}
            </div>
          )}
        </div>
      )}

      <a href="/" style={{
        display: 'inline-block',
        padding: '14px 28px',
        backgroundColor: 'var(--burgundy-deep, #5D1A1F)',
        color: '#fff',
        textDecoration: 'none',
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: '0.85rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        transition: 'background 0.3s'
      }}>
        Continue Shopping
      </a>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '80px 40px' }}>
        <div style={{
          fontFamily: 'var(--font-amiri), serif',
          fontSize: '2rem',
          color: 'var(--copper, #C17A48)'
        }}>
          جاري التحقق...
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
