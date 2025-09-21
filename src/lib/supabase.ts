// types/supabase.ts
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
      activity_logs: {
        Row: {
          id: string
          profile_id: string | null
          organization_id: string | null
          action: string
          entity: string | null
          entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          organization_id?: string | null
          action: string
          entity?: string | null
          entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          organization_id?: string | null
          action?: string
          entity?: string | null
          entity_id?: string | null
          created_at?: string
        }
      }
      campaign_recipients: {
        Row: {
          id: string
          campaign_id: string
          client_id: string
          status: "pending" | "sent" | "failed"
          sent_at: string | null
        }
        Insert: {
          id?: string
          campaign_id: string
          client_id: string
          status?: "pending" | "sent" | "failed"
          sent_at?: string | null
        }
        Update: {
          id?: string
          campaign_id?: string
          client_id?: string
          status?: "pending" | "sent" | "failed"
          sent_at?: string | null
        }
      }
      campaigns: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          scheduled_at: string | null
          status: "draft" | "scheduled" | "sent" | "cancelled" | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          scheduled_at?: string | null
          status?: "draft" | "scheduled" | "sent" | "cancelled" | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          scheduled_at?: string | null
          status?: "draft" | "scheduled" | "sent" | "cancelled" | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          organization_id: string
          full_name: string
          email: string | null
          phone_number: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          full_name: string
          email?: string | null
          phone_number?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          full_name?: string
          email?: string | null
          phone_number?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          profile_id: string
          role: "org_admin" | "org_staff" | "sys_admin"
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          profile_id: string
          role: "org_admin" | "org_staff" | "sys_admin"
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          profile_id?: string
          role?: "org_admin" | "org_staff" | "sys_admin"
          created_at?: string
          updated_at?: string | null
        }
      }
      organizations: {
        Row: {
          id: string
          company_name: string
          industry: string | null
          created_at: string
          owner_id: string
          street_adr: string | null
          prov: string | null
          postal_code: string | null
          updated_at: string | null
          city: string | null
        }
        Insert: {
          id?: string
          company_name: string
          industry?: string | null
          created_at?: string
          owner_id: string
          street_adr?: string | null
          prov?: string | null
          postal_code?: string | null
          updated_at?: string | null
          city?: string | null
        }
        Update: {
          id?: string
          company_name?: string
          industry?: string | null
          created_at?: string
          owner_id?: string
          street_adr?: string | null
          prov?: string | null
          postal_code?: string | null
          updated_at?: string | null
          city?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone_number: string
          role: "sys_admin" | "org_admin" | "org_staff" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone_number: string
          role?: "sys_admin" | "org_admin" | "org_staff" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone_number?: string
          role?: "sys_admin" | "org_admin" | "org_staff" | null
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          organization_id: string
          client_id: string
          created_by: string
          title: string
          message: string | null
          remind_at: string
          status: "pending" | "sent" | "cancelled"
          channel: "sms" | "email" | "call" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          client_id: string
          created_by: string
          title: string
          message?: string | null
          remind_at: string
          status?: "pending" | "sent" | "cancelled"
          channel?: "sms" | "email" | "call" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          client_id?: string
          created_by?: string
          title?: string
          message?: string | null
          remind_at?: string
          status?: "pending" | "sent" | "cancelled"
          channel?: "sms" | "email" | "call" | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          organization_id: string
          key: string
          value: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          key: string
          value?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          key?: string
          value?: Json | null
          created_at?: string
        }
      }
    }
  }
}