import { supabase } from '../supabaseClient';
import { CartItem, ShippingDetails } from '../types';

export interface PurchaseRecord {
  order_id?: string;
  product_name: string;
  product_price: number;
  quantity_purchased: number;
  customer_name: string;
  email_address: string;
  phone_number: string;
  delivery_address: string;
  purchase_date_time: string;
  order_status: string;
  payment_status: string;
}

/**
 * Saves purchase records for each cart item into Supabase 'purchases' table.
 */
export async function savePurchasesToSupabase(
  orderId: string,
  items: CartItem[],
  customer: ShippingDetails,
  paymentMethod: 'upi' | 'card' | 'cod'
): Promise<{ success: boolean; error?: any }> {
  const fullAddress = `${customer.address.trim()}, ${customer.city.trim()}, ${customer.state.trim()} - ${customer.postalCode.trim()}, ${customer.country.trim()}`;
  const now = new Date().toISOString();

  let paymentStatus = 'Paid';
  if (paymentMethod === 'cod') {
    paymentStatus = 'Pending (Cash on Delivery)';
  } else if (paymentMethod === 'upi') {
    paymentStatus = 'Paid (UPI)';
  } else if (paymentMethod === 'card') {
    paymentStatus = 'Paid (Card)';
  }

  const records: PurchaseRecord[] = items.map((item) => ({
    order_id: orderId,
    product_name: item.product.name,
    product_price: item.price,
    quantity_purchased: item.quantity,
    customer_name: customer.fullName.trim(),
    email_address: customer.email.trim(),
    phone_number: customer.phone.trim(),
    delivery_address: fullAddress,
    purchase_date_time: now,
    order_status: 'Confirmed',
    payment_status: paymentStatus,
  }));

  try {
    const { data, error } = await supabase.from('purchases').insert(records);
    if (error) {
      console.warn('Supabase purchases insert notice:', error.message);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.warn('Network error when recording purchase to Supabase:', err);
    return { success: false, error: err };
  }
}
