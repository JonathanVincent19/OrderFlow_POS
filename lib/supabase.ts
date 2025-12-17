/**
 * Supabase Client Configuration
 * 
 * Purpose: Initialize Supabase client for database operations
 * Exports:
 * - supabase: Client-side Supabase client (browser)
 * - supabaseAdmin: Server-side Supabase client (admin operations)
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For build time, provide placeholder if env vars not set
// This allows build to succeed, but will fail at runtime if not set
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

// Client for client-side components (browser)
export const supabase = createClient(url, key);

// Runtime validation - check if env vars are actually set
if (typeof window === 'undefined') {
  // Server-side: validate at runtime
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Missing Supabase environment variables!');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  }
} else {
  // Client-side: validate at runtime
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Missing Supabase environment variables!');
  }
}

// Admin client for server-side operations (with service role key)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      menu_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string | null;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string | null;
          table_number: string | null;
          order_notes: string | null;
          status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
          total_price: number;
          created_at: string;
          accepted_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          table_number?: string | null;
          order_notes?: string | null;
          status?: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
          total_price: number;
          created_at?: string;
          accepted_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          customer_name?: string | null;
          table_number?: string | null;
          order_notes?: string | null;
          status?: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'rejected';
          total_price?: number;
          created_at?: string;
          accepted_at?: string | null;
          completed_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price_at_order_time: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          price_at_order_time: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          quantity?: number;
          price_at_order_time?: number;
          created_at?: string;
        };
      };
    };
  };
};

