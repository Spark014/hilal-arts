import Stripe from 'stripe'

let stripeInstance = null

export function getStripe() {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
      typescript: false,
    })
  }
  return stripeInstance
}

// Keep backward compat — lazy getter
export const stripe = new Proxy({}, {
  get(_, prop) {
    return getStripe()[prop]
  }
})
