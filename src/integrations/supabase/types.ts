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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          created_at: string | null
          id: string
          mood_entry_id: string | null
          personalization_factors: Json | null
          suggestion_text: string
          suggestion_type: string
          user_feedback: string | null
          user_id: string
          user_rating: number | null
          was_helpful: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_entry_id?: string | null
          personalization_factors?: Json | null
          suggestion_text: string
          suggestion_type: string
          user_feedback?: string | null
          user_id: string
          user_rating?: number | null
          was_helpful?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_entry_id?: string | null
          personalization_factors?: Json | null
          suggestion_text?: string
          suggestion_type?: string
          user_feedback?: string | null
          user_id?: string
          user_rating?: number | null
          was_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_mood_entry_id_fkey"
            columns: ["mood_entry_id"]
            isOneToOne: false
            referencedRelation: "mood_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          activities: string[] | null
          ai_insights: Json | null
          ai_processing_status: string | null
          ai_suggestion: string | null
          created_at: string | null
          date_part: string | null
          emoji: string
          id: string
          intensity: number
          location: string | null
          mood: string
          note: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
          weather: string | null
        }
        Insert: {
          activities?: string[] | null
          ai_insights?: Json | null
          ai_processing_status?: string | null
          ai_suggestion?: string | null
          created_at?: string | null
          date_part?: string | null
          emoji: string
          id?: string
          intensity: number
          location?: string | null
          mood: string
          note?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          weather?: string | null
        }
        Update: {
          activities?: string[] | null
          ai_insights?: Json | null
          ai_processing_status?: string | null
          ai_suggestion?: string | null
          created_at?: string | null
          date_part?: string | null
          emoji?: string
          id?: string
          intensity?: number
          location?: string | null
          mood?: string
          note?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          weather?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_patterns: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          end_date: string
          id: string
          pattern_data: Json
          pattern_type: string
          start_date: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          end_date: string
          id?: string
          pattern_data: Json
          pattern_type: string
          start_date: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          end_date?: string
          id?: string
          pattern_data?: Json
          pattern_type?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_patterns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_credits_limit: number | null
          ai_credits_used: number | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_premium: boolean | null
          mood_entries_count: number | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          onboarding_data: Json | null
          preferred_language: string | null
          subscription_expires_at: string | null
          subscription_plan: string | null
          subscription_status: string | null
          timezone: string | null
          trial_started_at: string | null
          updated_at: string | null
        }
        Insert: {
          ai_credits_limit?: number | null
          ai_credits_used?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_premium?: boolean | null
          mood_entries_count?: number | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          preferred_language?: string | null
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          timezone?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_credits_limit?: number | null
          ai_credits_used?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          mood_entries_count?: number | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          onboarding_data?: Json | null
          preferred_language?: string | null
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          timezone?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          ls_customer_id: string | null
          ls_event_type: string
          ls_subscription_id: string | null
          ls_webhook_data: Json
          processed: boolean | null
          processed_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          ls_customer_id?: string | null
          ls_event_type: string
          ls_subscription_id?: string | null
          ls_webhook_data: Json
          processed?: boolean | null
          processed_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          ls_customer_id?: string | null
          ls_event_type?: string
          ls_subscription_id?: string | null
          ls_webhook_data?: Json
          processed?: boolean | null
          processed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          points_earned: number | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          points_earned?: number | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
