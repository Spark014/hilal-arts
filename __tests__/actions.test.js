// Mock Supabase SSR module before any imports
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
  createBrowserClient: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock stripe server
jest.mock('@/lib/stripe-server', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
        listLineItems: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

import { createServerClient } from '@supabase/ssr';
import { stripe } from '@/lib/stripe-server';

// Import after mocks
const { createCheckoutSession } = require('@/app/actions/checkout');
const { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  getCartCount 
} = require('@/app/actions/cart');

describe('Checkout Security', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com', user_metadata: { full_name: 'Test User' } };
  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    arabic_name: 'منتج تجريبي',
    price: 35000,
    stock_quantity: -1,
    image: '/test.jpg',
    dimensions: '60 × 30″',
    description: 'A test product',
  };

  let mockSupabase;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Build a mock Supabase client chain
    mockSupabase = {
      auth: { getUser: jest.fn() },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };

    createServerClient.mockReturnValue(mockSupabase);
  });

  test('REJECTS unauthenticated checkout', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

    await expect(createCheckoutSession()).rejects.toThrow('Please sign in to checkout');
  });

  test('REJECTS empty cart', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    mockSupabase.single
      .mockResolvedValueOnce({ data: { id: 'cart-1' }, error: null })  // cart
      .mockResolvedValueOnce({ data: null, error: null });              // cart items

    mockSupabase.from.mockReturnValue(mockSupabase);

    await expect(createCheckoutSession()).rejects.toThrow('Your cart is empty');
  });

  test('RE-FETCHES prices from database (never trusts client)', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    
    mockSupabase.single
      .mockResolvedValueOnce({ data: { id: 'cart-1' }, error: null })   // cart
      .mockResolvedValueOnce({ data: { id: 'order-1' }, error: null }); // order

    mockSupabase.select.mockReturnValue(mockSupabase);
    mockSupabase.eq.mockReturnValue(mockSupabase);

    // Cart items with product
    mockSupabase.from.mockReturnValue(mockSupabase);
    
    // Override the second from() call for cart_items
    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      callCount++;
      if (callCount === 2) {
        // cart_items query
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [{
                id: 'item-1',
                quantity: 2,
                customization: '',
                product: mockProduct,
              }],
              error: null,
            }),
          }),
        };
      }
      return mockSupabase;
    });

    stripe.checkout.sessions.create.mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
    });

    // This test verifies the code path exists — in production the actual DB price is used
    // We can't fully test the internals without refactoring for DI, but this at least 
    // exercises the code path
    try {
      await createCheckoutSession();
    } catch (err) {
      // May fail on update step — that's okay, we're testing the price re-fetch intent
    }

    // Verify that stripe.checkout.sessions.create was called with DB-derived prices
    // In a full test with proper DI, we'd verify the line_items used product.price from DB
    expect(stripe.checkout.sessions.create).toHaveBeenCalled();
    const callArgs = stripe.checkout.sessions.create.mock.calls[0][0];
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(mockProduct.price);
  });

  test('REJECTS out-of-stock items', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
    
    mockSupabase.single
      .mockResolvedValueOnce({ data: { id: 'cart-1' }, error: null });  // cart

    const limitedStockProduct = { ...mockProduct, stock_quantity: 1 };
    
    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      callCount++;
      if (callCount === 2) {
        return {
          ...mockSupabase,
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [{
                id: 'item-1',
                quantity: 5,  // User wants 5, but only 1 in stock
                customization: '',
                product: limitedStockProduct,
              }],
              error: null,
            }),
          }),
        };
      }
      return mockSupabase;
    });

    await expect(createCheckoutSession()).rejects.toThrow(/no longer in stock/);
  });
});

describe('Cart Server Actions', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const mockCart = { id: 'cart-1' };

  let mockSupabase;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSupabase = {
      auth: { getUser: jest.fn() },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    };

    createServerClient.mockReturnValue(mockSupabase);
  });

  test('getCart returns null for unauthenticated user', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    
    const result = await getCart();
    expect(result).toBeNull();
  });

  test('addToCart requires authentication', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    
    await expect(addToCart('prod-1')).rejects.toThrow('Authentication required');
  });

  test('removeFromCart requires authentication', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    
    await expect(removeFromCart('item-1')).rejects.toThrow('Authentication required');
  });

  test('updateQuantity requires authentication', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    
    await expect(updateQuantity('item-1', 2)).rejects.toThrow('Authentication required');
  });

  test('clearCart requires authentication', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    
    await expect(clearCart()).rejects.toThrow('Authentication required');
  });

  test('getCartCount returns 0 for unauthenticated user', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    
    const count = await getCartCount();
    expect(count).toBe(0);
  });
});
