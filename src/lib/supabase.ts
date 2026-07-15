import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image?: string | null
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image?: string | null
          parent_id?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          compare_at_price: number | null
          images: string[]
          colors: string[]
          rating: number
          review_count: number
          stock: number
          category_id: string
          is_featured: boolean
          is_new: boolean
          is_best_seller: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          price: number
          compare_at_price?: number | null
          images: string[]
          colors: string[]
          rating?: number
          review_count?: number
          stock: number
          category_id: string
          is_featured?: boolean
          is_new?: boolean
          is_best_seller?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          price?: number
          compare_at_price?: number | null
          images?: string[]
          colors?: string[]
          rating?: number
          review_count?: number
          stock?: number
          category_id?: string
          is_featured?: boolean
          is_new?: boolean
          is_best_seller?: boolean
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string | null
          role: 'customer' | 'admin'
          addresses: any[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone?: string | null
          role?: 'customer' | 'admin'
          addresses?: any[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string | null
          role?: 'customer' | 'admin'
          addresses?: any[]
          created_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          guest_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          guest_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          guest_id?: string | null
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          quantity?: number
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          quantity?: number
          color?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          shipping_cost: number
          total: number
          shipping_address: any
          billing_address: any | null
          payment_method: 'stripe' | 'payhere' | 'cod'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          shipping_cost?: number
          total: number
          shipping_address: any
          billing_address?: any | null
          payment_method: 'stripe' | 'payhere' | 'cod'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal?: number
          shipping_cost?: number
          total?: number
          shipping_address?: any
          billing_address?: any | null
          payment_method?: 'stripe' | 'payhere' | 'cod'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_image: string
          quantity: number
          unit_price: number
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_image: string
          quantity: number
          unit_price: number
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_image?: string
          quantity?: number
          unit_price?: number
          color?: string | null
          created_at?: string
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: string
          note?: string | null
          created_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          order_id: string
          provider: 'stripe' | 'payhere'
          provider_payment_id: string
          amount: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          raw_response: any | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          provider: 'stripe' | 'payhere'
          provider_payment_id: string
          amount: number
          currency?: string
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          raw_response?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          provider?: 'stripe' | 'payhere'
          provider_payment_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          raw_response?: any | null
          created_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string | null
          images: string[]
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment?: string | null
          images?: string[]
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string | null
          images?: string[]
          is_verified?: boolean
          created_at?: string
        }
      }
    }
    Enums: {
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
      payment_method: 'stripe' | 'payhere' | 'cod'
      user_role: 'customer' | 'admin'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
