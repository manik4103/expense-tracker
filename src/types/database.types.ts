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
      profiles: {
        Row: {
          id: string
          full_name: string
          role: 'admin' | 'staff'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: 'admin' | 'staff'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: 'admin' | 'staff'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_units: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          id: string
          category_id: string
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sub_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      recipients: {
        Row: {
          id: string
          name: string
          type: 'supplier' | 'agent' | 'utility' | 'individual' | 'other' | null
          phone: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: 'supplier' | 'agent' | 'utility' | 'individual' | 'other' | null
          phone?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'supplier' | 'agent' | 'utility' | 'individual' | 'other' | null
          phone?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          id: string
          expense_date: string
          category_id: string
          sub_category_id: string | null
          business_unit_id: string | null
          recipient_id: string | null
          amount: number
          notes: string | null
          entered_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          expense_date: string
          category_id: string
          sub_category_id?: string | null
          business_unit_id?: string | null
          recipient_id?: string | null
          amount: number
          notes?: string | null
          entered_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          expense_date?: string
          category_id?: string
          sub_category_id?: string | null
          business_unit_id?: string | null
          recipient_id?: string | null
          amount?: number
          notes?: string | null
          entered_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'expenses_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'expenses_sub_category_id_fkey'
            columns: ['sub_category_id']
            isOneToOne: false
            referencedRelation: 'sub_categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'expenses_business_unit_id_fkey'
            columns: ['business_unit_id']
            isOneToOne: false
            referencedRelation: 'business_units'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'expenses_recipient_id_fkey'
            columns: ['recipient_id']
            isOneToOne: false
            referencedRelation: 'recipients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'expenses_entered_by_fkey'
            columns: ['entered_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
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
