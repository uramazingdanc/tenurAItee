export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about: {
        Row: {
          created_at: string | null
          id: string
          mission: string
          story: string
          updated_at: string | null
          vision: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mission?: string
          story?: string
          updated_at?: string | null
          vision?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mission?: string
          story?: string
          updated_at?: string | null
          vision?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_performance: {
        Row: {
          created_at: string
          customer_satisfaction: number | null
          id: string
          improvement_areas: Json | null
          issue_resolution_rate: number | null
          period_end: string
          period_start: string
          response_accuracy: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_satisfaction?: number | null
          id?: string
          improvement_areas?: Json | null
          issue_resolution_rate?: number | null
          period_end: string
          period_start: string
          response_accuracy?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_satisfaction?: number | null
          id?: string
          improvement_areas?: Json | null
          issue_resolution_rate?: number | null
          period_end?: string
          period_start?: string
          response_accuracy?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_progress: {
        Row: {
          created_at: string
          current_level: number
          current_streak: number
          id: string
          last_activity_date: string
          updated_at: string
          user_id: string
          xp_points: number
        }
        Insert: {
          created_at?: string
          current_level?: number
          current_streak?: number
          id?: string
          last_activity_date?: string
          updated_at?: string
          user_id: string
          xp_points?: number
        }
        Update: {
          created_at?: string
          current_level?: number
          current_streak?: number
          id?: string
          last_activity_date?: string
          updated_at?: string
          user_id?: string
          xp_points?: number
        }
        Relationships: []
      }
      ai_chat_history: {
        Row: {
          id: string
          kb_articles: Json | null
          message: string
          role: string
          session_id: string
          suggestions: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          id?: string
          kb_articles?: Json | null
          message: string
          role: string
          session_id: string
          suggestions?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          id?: string
          kb_articles?: Json | null
          message?: string
          role?: string
          session_id?: string
          suggestions?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string | null
          id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string | null
          id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string | null
          id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          is_premium: boolean
          name: string
          tier_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_premium?: boolean
          name: string
          tier_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_premium?: boolean
          name?: string
          tier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "features_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_items: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          is_premium: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      plan_features: {
        Row: {
          created_at: string | null
          feature: string
          id: string
          plan_id: string
        }
        Insert: {
          created_at?: string | null
          feature: string
          id?: string
          plan_id: string
        }
        Update: {
          created_at?: string | null
          feature?: string
          id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "pricing_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_custom: boolean
          most_popular: boolean
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          is_custom?: boolean
          most_popular?: boolean
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_custom?: boolean
          most_popular?: boolean
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string
          id: string
          is_premium: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty: string
          id?: string
          is_premium?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          id?: string
          is_premium?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          bio?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          bio?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tiers: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_free: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          is_free?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_free?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          feedback: string | null
          id: string
          scenario_id: string
          score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          scenario_id: string
          score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          scenario_id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      video_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          is_premium: boolean | null
          thumbnail_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          is_premium?: boolean | null
          thumbnail_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          is_premium?: boolean | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
