type NoEntries = { [_ in never]: never }

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string
          user_id: string | null
          username: string
          avatar_url: string | null
          content: string
          created_at: string
        }
        Insert: {
          content: string
        }
        Update: NoEntries
        Relationships: []
      }
    }
    Views: NoEntries
    Functions: NoEntries
    Enums: NoEntries
    CompositeTypes: NoEntries
  }
}

export type MessageRow = Pick<
  Database['public']['Tables']['messages']['Row'],
  'id' | 'username' | 'avatar_url' | 'content' | 'created_at'
>
