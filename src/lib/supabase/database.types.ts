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
      campuses: {
        Row: {
          id: string
          name: string
          short_code: string
          city: string
          state: string
          domain_suffix: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          short_code: string
          city: string
          state: string
          domain_suffix?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_code?: string
          city?: string
          state?: string
          domain_suffix?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          campus_id: string | null
          full_name: string
          avatar_url: string | null
          college_email: string | null
          is_student_verified: boolean
          degree_program: string | null
          current_year: number
          current_semester: number
          phone_number: string | null
          upi_id: string | null
          total_transactions: number
          successful_transactions: number
          response_rate_percent: number
          avg_response_minutes: number
          trust_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          campus_id?: string | null
          full_name: string
          avatar_url?: string | null
          college_email?: string | null
          is_student_verified?: boolean
          degree_program?: string | null
          current_year?: number
          current_semester?: number
          phone_number?: string | null
          upi_id?: string | null
          total_transactions?: number
          successful_transactions?: number
          response_rate_percent?: number
          avg_response_minutes?: number
          trust_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campus_id?: string | null
          full_name?: string
          avatar_url?: string | null
          college_email?: string | null
          is_student_verified?: boolean
          degree_program?: string | null
          current_year?: number
          current_semester?: number
          phone_number?: string | null
          upi_id?: string | null
          total_transactions?: number
          successful_transactions?: number
          response_rate_percent?: number
          avg_response_minutes?: number
          trust_rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          seller_id: string
          campus_id: string
          category_id: string
          title: string
          description: string | null
          images: string[]
          mode: 'BUY' | 'EXCHANGE' | 'RENT' | 'GIVE_AWAY'
          price: number
          original_new_price: number | null
          exchange_details: string | null
          rental_rate_per_week: number | null
          condition: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'FOR_PARTS'
          book_has_highlighting: boolean
          book_has_writing: boolean
          book_missing_pages: boolean
          book_cover_wear: boolean
          book_edition: string | null
          book_isbn: string | null
          target_course: string | null
          relevant_semesters: number[]
          is_bundle: boolean
          bundle_items: string[]
          status: 'DRAFT' | 'ACTIVE' | 'OFFER_RECEIVED' | 'RESERVED' | 'MEETING_SCHEDULED' | 'SOLD' | 'EXPIRED' | 'CANCELLED' | 'REPORTED'
          preferred_spot_id: string | null
          views_count: number
          saves_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          campus_id: string
          category_id: string
          title: string
          description?: string | null
          images?: string[]
          mode?: 'BUY' | 'EXCHANGE' | 'RENT' | 'GIVE_AWAY'
          price?: number
          original_new_price?: number | null
          exchange_details?: string | null
          rental_rate_per_week?: number | null
          condition?: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'FOR_PARTS'
          book_has_highlighting?: boolean
          book_has_writing?: boolean
          book_missing_pages?: boolean
          book_cover_wear?: boolean
          book_edition?: string | null
          book_isbn?: string | null
          target_course?: string | null
          relevant_semesters?: number[]
          is_bundle?: boolean
          bundle_items?: string[]
          status?: 'DRAFT' | 'ACTIVE' | 'OFFER_RECEIVED' | 'RESERVED' | 'MEETING_SCHEDULED' | 'SOLD' | 'EXPIRED' | 'CANCELLED' | 'REPORTED'
          preferred_spot_id?: string | null
          views_count?: number
          saves_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          campus_id?: string
          category_id?: string
          title?: string
          description?: string | null
          images?: string[]
          mode?: 'BUY' | 'EXCHANGE' | 'RENT' | 'GIVE_AWAY'
          price?: number
          original_new_price?: number | null
          exchange_details?: string | null
          rental_rate_per_week?: number | null
          condition?: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'FOR_PARTS'
          book_has_highlighting?: boolean
          book_has_writing?: boolean
          book_missing_pages?: boolean
          book_cover_wear?: boolean
          book_edition?: string | null
          book_isbn?: string | null
          target_course?: string | null
          relevant_semesters?: number[]
          is_bundle?: boolean
          bundle_items?: string[]
          status?: 'DRAFT' | 'ACTIVE' | 'OFFER_RECEIVED' | 'RESERVED' | 'MEETING_SCHEDULED' | 'SOLD' | 'EXPIRED' | 'CANCELLED' | 'REPORTED'
          preferred_spot_id?: string | null
          views_count?: number
          saves_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      need_requests: {
        Row: {
          id: string
          buyer_id: string
          campus_id: string
          category_id: string | null
          item_title: string
          max_budget: number
          preferred_condition: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'FOR_PARTS'
          required_by_date: string | null
          notes: string | null
          target_semester: number | null
          status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED'
          matched_listing_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          campus_id: string
          category_id?: string | null
          item_title: string
          max_budget: number
          preferred_condition?: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'FOR_PARTS'
          required_by_date?: string | null
          notes?: string | null
          target_semester?: number | null
          status?: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED'
          matched_listing_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          campus_id?: string
          category_id?: string | null
          item_title?: string
          max_budget?: number
          preferred_condition?: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'FOR_PARTS'
          required_by_date?: string | null
          notes?: string | null
          target_semester?: number | null
          status?: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED'
          matched_listing_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          offered_amount: number
          counter_amount: number | null
          status: 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'
          meeting_spot_id: string | null
          meeting_time: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          seller_id: string
          offered_amount: number
          counter_amount?: number | null
          status?: 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'
          meeting_spot_id?: string | null
          meeting_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          seller_id?: string
          offered_amount?: number
          counter_amount?: number | null
          status?: 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'
          meeting_spot_id?: string | null
          meeting_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          listing_id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          sender_id: string
          receiver_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
