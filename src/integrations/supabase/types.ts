export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointment_tokens: {
        Row: {
          appointment_date: string
          created_at: string
          current_token: number
          id: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          current_token?: number
          id?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          current_token?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          department: string | null
          doctor_name: string | null
          id: string
          notes: string | null
          patient_id: string | null
          reason: string | null
          status: string | null
          token: number | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          department?: string | null
          doctor_name?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason?: string | null
          status?: string | null
          token?: number | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          department?: string | null
          doctor_name?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          reason?: string | null
          status?: string | null
          token?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_profiles: {
        Row: {
          availability: string | null
          created_at: string
          experience: string | null
          id: string
          license_number: string | null
          specialty: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          experience?: string | null
          id?: string
          license_number?: string | null
          specialty?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          experience?: string | null
          id?: string
          license_number?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          availability: string | null
          created_at: string
          email: string | null
          experience: string | null
          id: string
          name: string
          phone: string | null
          specialty: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          id?: string
          name: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          id?: string
          name?: string
          phone?: string | null
          specialty?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patient_profiles: {
        Row: {
          allergies: string[] | null
          blood_group: string | null
          created_at: string
          current_medications: string[] | null
          id: string
          medical_history: string[] | null
          mr_number: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          current_medications?: string[] | null
          id?: string
          medical_history?: string[] | null
          mr_number: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          current_medications?: string[] | null
          id?: string
          medical_history?: string[] | null
          mr_number?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          age: number | null
          allergies: string[] | null
          blood_group: string | null
          created_at: string
          current_medications: string[] | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          gender: string | null
          id: string
          medical_history: string[] | null
          mr_number: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          current_medications?: string[] | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          medical_history?: string[] | null
          mr_number: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          allergies?: string[] | null
          blood_group?: string | null
          created_at?: string
          current_medications?: string[] | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          medical_history?: string[] | null
          mr_number?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string
          id: string
          is_available: boolean | null
          slot_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          slot_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          slot_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_communication: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_communication_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          date_of_birth: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_email_by_username: {
        Args: { check_username: string }
        Returns: string
      }
      get_next_token: {
        Args: { appointment_date: string }
        Returns: number
      }
      is_username_available: {
        Args: { check_username: string }
        Returns: boolean
      }
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
