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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          images: string[]
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          images?: string[]
          price: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          images?: string[]
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_bookings: {
        Row: {
          activity_id: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          participants: number
          phone: string
          status: Database["public"]["Enums"]["reservation_status"]
          total_price: number | null
          user_id: string | null
        }
        Insert: {
          activity_id: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          participants?: number
          phone: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_price?: number | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          participants?: number
          phone?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_price?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_bookings_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          payload: Json
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          payload?: Json
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          payload?: Json
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          check_in: string
          check_out: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          nights: number | null
          payment_method: string
          phone: string
          room_id: string
          status: Database["public"]["Enums"]["reservation_status"]
          total_price: number | null
          transaction_code: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          nights?: number | null
          payment_method?: string
          phone: string
          room_id: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_price?: number | null
          transaction_code?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          nights?: number | null
          payment_method?: string
          phone?: string
          room_id?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          total_price?: number | null
          transaction_code?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "occupancy_stats"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          id: string
          images: string[]
          name: string
          status: Database["public"]["Enums"]["item_status"]
        }
        Insert: {
          capacity: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name: string
          status?: Database["public"]["Enums"]["item_status"]
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name?: string
          status?: Database["public"]["Enums"]["item_status"]
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[]
          capacity: number
          created_at: string
          description: string | null
          id: string
          images: string[]
          is_featured: boolean
          price: number
          room_type: string | null
          services: string[]
          slug: string
          status: Database["public"]["Enums"]["item_status"]
          surface: number | null
          title: string
          updated_at: string
        }
        Insert: {
          amenities?: string[]
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean
          price: number
          room_type?: string | null
          services?: string[]
          slug: string
          status?: Database["public"]["Enums"]["item_status"]
          surface?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          amenities?: string[]
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean
          price?: number
          room_type?: string | null
          services?: string[]
          slug?: string
          status?: Database["public"]["Enums"]["item_status"]
          surface?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      table_reservations: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          party_size: number
          phone: string
          reservation_date: string
          reservation_time: string
          status: Database["public"]["Enums"]["reservation_status"]
          table_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          party_size: number
          phone: string
          reservation_date: string
          reservation_time: string
          status?: Database["public"]["Enums"]["reservation_status"]
          table_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          party_size?: number
          phone?: string
          reservation_date?: string
          reservation_time?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          table_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      occupancy_stats: {
        Row: {
          confirmed_bookings: number | null
          nights_booked: number | null
          room_id: string | null
          title: string | null
        }
        Relationships: []
      }
      reservation_stats_monthly: {
        Row: {
          confirmed_reservations: number | null
          pending_reservations: number | null
          period: string | null
          rejected_reservations: number | null
          revenue: number | null
          total_reservations: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_room_available: {
        Args: {
          p_check_in: string
          p_check_out: string
          p_exclude_reservation_id?: string
          p_room_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      item_status: "available" | "maintenance" | "inactive"
      reservation_status: "pending" | "confirmed" | "rejected" | "cancelled"
      user_role: "admin" | "user"
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
      item_status: ["available", "maintenance", "inactive"],
      reservation_status: ["pending", "confirmed", "rejected", "cancelled"],
      user_role: ["admin", "user"],
    },
  },
} as const
