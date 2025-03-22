export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string
          text: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          text: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          text?: string
          user_id?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          created_at: string
          post_id: string
          user_id: string
          trait: string
          value: number
        }
        Insert: {
          id?: string
          created_at?: string
          post_id: string
          user_id: string
          trait: string
          value: number
        }
        Update: {
          id?: string
          created_at?: string
          post_id?: string
          user_id?: string
          trait?: string
          value?: number
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          extroversion: number
          openness: number
          conscientiousness: number
          optimism: number
          independence: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          extroversion?: number
          openness?: number
          conscientiousness?: number
          optimism?: number
          independence?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          extroversion?: number
          openness?: number
          conscientiousness?: number
          optimism?: number
          independence?: number
        }
      }
    }
  }
}