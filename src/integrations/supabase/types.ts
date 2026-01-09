export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booked_seats: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          price: number
          row_name: string | null
          schedule_id: string
          seat_id: string | null
          seat_number: number | null
          section_name: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          price: number
          row_name?: string | null
          schedule_id: string
          seat_id?: string | null
          seat_number?: number | null
          section_name?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          price?: number
          row_name?: string | null
          schedule_id?: string
          seat_id?: string | null
          seat_number?: number | null
          section_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booked_seats_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booked_seats_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "event_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booked_seats_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seat_layouts"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_number: string
          created_at: string
          discount_amount: number | null
          event_id: string
          final_amount: number
          id: string
          notes: string | null
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          qr_code: string | null
          schedule_id: string
          status: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_number: string
          created_at?: string
          discount_amount?: number | null
          event_id: string
          final_amount: number
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          qr_code?: string | null
          schedule_id: string
          status?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_number?: string
          created_at?: string
          discount_amount?: number | null
          event_id?: string
          final_amount?: number
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          qr_code?: string | null
          schedule_id?: string
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "event_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      event_schedules: {
        Row: {
          available_seats: number | null
          created_at: string
          end_time: string | null
          event_id: string
          id: string
          is_active: boolean | null
          price_max: number | null
          price_min: number
          start_time: string
          total_seats: number | null
          venue_id: string
        }
        Insert: {
          available_seats?: number | null
          created_at?: string
          end_time?: string | null
          event_id: string
          id?: string
          is_active?: boolean | null
          price_max?: number | null
          price_min: number
          start_time: string
          total_seats?: number | null
          venue_id: string
        }
        Update: {
          available_seats?: number | null
          created_at?: string
          end_time?: string | null
          event_id?: string
          id?: string
          is_active?: boolean | null
          price_max?: number | null
          price_min?: number
          start_time?: string
          total_seats?: number | null
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_schedules_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          age_restriction: string | null
          banner_url: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          language: string | null
          rating: string | null
          tags: string[] | null
          title: string
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          age_restriction?: string | null
          banner_url?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          language?: string | null
          rating?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          age_restriction?: string | null
          banner_url?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          language?: string | null
          rating?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount: number | null
          min_purchase: number | null
          title: string
          usage_limit: number | null
          used_count: number | null
          valid_from: string
          valid_until: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          title: string
          usage_limit?: number | null
          used_count?: number | null
          valid_from: string
          valid_until: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          title?: string
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seat_layouts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          price_multiplier: number | null
          row_name: string
          seat_number: number
          seat_type: string | null
          section_name: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          price_multiplier?: number | null
          row_name: string
          seat_number: number
          seat_type?: string | null
          section_name: string
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          price_multiplier?: number | null
          row_name?: string
          seat_number?: number
          seat_type?: string | null
          section_name?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_layouts_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          amenities: string[] | null
          capacity: number | null
          city: string
          country: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean | null
          location_lat: number | null
          location_lng: number | null
          name: string
          state: string | null
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          capacity?: number | null
          city: string
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          capacity?: number | null
          city?: string
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
