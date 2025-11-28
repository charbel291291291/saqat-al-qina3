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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      case_evidence: {
        Row: {
          case_id: string
          created_at: string
          file_type: string
          file_url: string
          id: string
          thumbnail_url: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          file_type: string
          file_url: string
          id?: string
          thumbnail_url?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_evidence_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_officials: {
        Row: {
          assigned_at: string
          case_id: string
          id: string
          official_id: string
        }
        Insert: {
          assigned_at?: string
          case_id: string
          id?: string
          official_id: string
        }
        Update: {
          assigned_at?: string
          case_id?: string
          id?: string
          official_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_officials_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_officials_official_id_fkey"
            columns: ["official_id"]
            isOneToOne: false
            referencedRelation: "officials"
            referencedColumns: ["id"]
          },
        ]
      }
      case_timeline_events: {
        Row: {
          case_id: string
          created_at: string
          created_by: string | null
          event_description: string
          event_type: string
          id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by?: string | null
          event_description: string
          event_type: string
          id?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string | null
          event_description?: string
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_timeline_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          admin_notes: string | null
          assigned_journalist: string | null
          category: Database["public"]["Enums"]["case_category"]
          created_at: string
          detailed_description: string
          id: string
          municipality: string | null
          published_at: string | null
          region: Database["public"]["Enums"]["region"]
          rejection_reason: string | null
          resolved_at: string | null
          short_description: string
          status: Database["public"]["Enums"]["case_status"]
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_journalist?: string | null
          category: Database["public"]["Enums"]["case_category"]
          created_at?: string
          detailed_description: string
          id?: string
          municipality?: string | null
          published_at?: string | null
          region: Database["public"]["Enums"]["region"]
          rejection_reason?: string | null
          resolved_at?: string | null
          short_description: string
          status?: Database["public"]["Enums"]["case_status"]
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          assigned_journalist?: string | null
          category?: Database["public"]["Enums"]["case_category"]
          created_at?: string
          detailed_description?: string
          id?: string
          municipality?: string | null
          published_at?: string | null
          region?: Database["public"]["Enums"]["region"]
          rejection_reason?: string | null
          resolved_at?: string | null
          short_description?: string
          status?: Database["public"]["Enums"]["case_status"]
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_assigned_journalist_fkey"
            columns: ["assigned_journalist"]
            isOneToOne: false
            referencedRelation: "journalists"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          assigned_journalist: string | null
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          assigned_journalist?: string | null
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          assigned_journalist?: string | null
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_assigned_journalist_fkey"
            columns: ["assigned_journalist"]
            isOneToOne: false
            referencedRelation: "journalists"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          case_id: string
          comment_text: string
          created_at: string
          flag_reason: string | null
          id: string
          is_approved: boolean | null
          is_flagged: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          case_id: string
          comment_text: string
          created_at?: string
          flag_reason?: string | null
          id?: string
          is_approved?: boolean | null
          is_flagged?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          case_id?: string
          comment_text?: string
          created_at?: string
          flag_reason?: string | null
          id?: string
          is_approved?: boolean | null
          is_flagged?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          region: Database["public"]["Enums"]["region"] | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          region?: Database["public"]["Enums"]["region"] | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          region?: Database["public"]["Enums"]["region"] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      journalists: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone_number: string
          role: Database["public"]["Enums"]["journalist_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone_number: string
          role?: Database["public"]["Enums"]["journalist_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone_number?: string
          role?: Database["public"]["Enums"]["journalist_role"]
          updated_at?: string
        }
        Relationships: []
      }
      official_responses: {
        Row: {
          attachments: Json | null
          case_id: string
          created_at: string
          id: string
          official_id: string
          response_date: string
          response_text: string
        }
        Insert: {
          attachments?: Json | null
          case_id: string
          created_at?: string
          id?: string
          official_id: string
          response_date?: string
          response_text: string
        }
        Update: {
          attachments?: Json | null
          case_id?: string
          created_at?: string
          id?: string
          official_id?: string
          response_date?: string
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "official_responses_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "official_responses_official_id_fkey"
            columns: ["official_id"]
            isOneToOne: false
            referencedRelation: "officials"
            referencedColumns: ["id"]
          },
        ]
      }
      officials: {
        Row: {
          created_at: string
          execution_score: number | null
          followup_score: number | null
          id: string
          image_url: string | null
          institution_id: string | null
          name: string
          overall_score: number | null
          position: string
          region: Database["public"]["Enums"]["region"]
          respect_score: number | null
          response_speed_score: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          execution_score?: number | null
          followup_score?: number | null
          id?: string
          image_url?: string | null
          institution_id?: string | null
          name: string
          overall_score?: number | null
          position: string
          region: Database["public"]["Enums"]["region"]
          respect_score?: number | null
          response_speed_score?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          execution_score?: number | null
          followup_score?: number | null
          id?: string
          image_url?: string | null
          institution_id?: string | null
          name?: string
          overall_score?: number | null
          position?: string
          region?: Database["public"]["Enums"]["region"]
          respect_score?: number | null
          response_speed_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "officials_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      app_role: "user" | "admin" | "investigator"
      case_category:
        | "municipality"
        | "corruption"
        | "environment"
        | "education"
        | "health"
        | "electricity"
        | "water"
        | "roads"
        | "other"
      case_status:
        | "draft"
        | "pending_review"
        | "published"
        | "sent_to_official"
        | "waiting_response"
        | "official_replied"
        | "follow_up"
        | "resolved"
        | "ignored"
        | "closed"
      journalist_role: "investigator" | "journalist" | "editor"
      region:
        | "beirut"
        | "mount_lebanon"
        | "north"
        | "south"
        | "bekaa"
        | "nabatieh"
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
      app_role: ["user", "admin", "investigator"],
      case_category: [
        "municipality",
        "corruption",
        "environment",
        "education",
        "health",
        "electricity",
        "water",
        "roads",
        "other",
      ],
      case_status: [
        "draft",
        "pending_review",
        "published",
        "sent_to_official",
        "waiting_response",
        "official_replied",
        "follow_up",
        "resolved",
        "ignored",
        "closed",
      ],
      journalist_role: ["investigator", "journalist", "editor"],
      region: [
        "beirut",
        "mount_lebanon",
        "north",
        "south",
        "bekaa",
        "nabatieh",
      ],
    },
  },
} as const
