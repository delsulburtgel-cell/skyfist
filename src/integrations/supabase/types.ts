export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      brands: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
        };
        Relationships: [];
      };
      members: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          img: string | null;
          name: string;
          notes: string | null;
          phone: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          img?: string | null;
          name: string;
          notes?: string | null;
          phone?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          img?: string | null;
          name?: string;
          notes?: string | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          price: number;
          product_id: string | null;
          product_name: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          price: number;
          product_id?: string | null;
          product_name: string;
          quantity: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          price?: number;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          customer_email: string | null;
          customer_name: string;
          customer_phone: string;
          id: string;
          notes: string | null;
          status: string;
          total_price: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          customer_email?: string | null;
          customer_name: string;
          customer_phone: string;
          id?: string;
          notes?: string | null;
          status?: string;
          total_price: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          customer_email?: string | null;
          customer_name?: string;
          customer_phone?: string;
          id?: string;
          notes?: string | null;
          status?: string;
          total_price?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          brand_id: string | null;
          category_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          price: number;
          price_formatted: string;
          specs: string[] | null;
          updated_at: string;
        };
        Insert: {
          brand_id?: string | null;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          price: number;
          price_formatted: string;
          specs?: string[] | null;
          updated_at?: string;
        };
        Update: {
          brand_id?: string | null;
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          price?: number;
          price_formatted?: string;
          specs?: string[] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          answer: string | null;
          created_at: string;
          id: string;
          question: string;
        };
        Insert: {
          answer?: string | null;
          created_at?: string;
          id?: string;
          question: string;
        };
        Update: {
          answer?: string | null;
          created_at?: string;
          id?: string;
          question?: string;
        };
        Relationships: [];
      };
      requests: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
