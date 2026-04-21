/**
 * Database Types for PekalonganPay
 * Matches the Supabase schema
 */

export interface Database {
    public: {
        Tables: {
            users: {
                Row: UserRow;
                Insert: UserInsert;
                Update: UserUpdate;
            };
            merchants_umkm: {
                Row: MerchantRow;
                Insert: MerchantInsert;
                Update: MerchantUpdate;
            };
            transactions: {
                Row: TransactionRow;
                Insert: TransactionInsert;
                Update: never; // Immutable
            };
            mosques: {
                Row: MosqueRow;
                Insert: MosqueInsert;
                Update: MosqueUpdate;
            };
            mosque_schedules: {
                Row: MosqueScheduleRow;
                Insert: MosqueScheduleInsert;
                Update: MosqueScheduleUpdate;
            };
            reviews: {
                Row: ReviewRow;
                Insert: ReviewInsert;
                Update: never;
            };
            city_events: {
                Row: CityEventRow;
                Insert: CityEventInsert;
                Update: CityEventUpdate;
            };
        };
    };
}

// ─── Users ──────────────────────────────────────────────────────
export interface UserRow {
    id: string;
    phone: string;
    full_name: string | null;
    nik: string | null;
    kyc_status: 'pending' | 'verified' | 'rejected';
    kyc_verified_at: string | null;
    device_id: string | null;
    device_model: string | null;
    pin_hash: string | null;
    biometric_enabled: boolean;
    balance: number;
    daily_limit: number;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface UserInsert {
    phone: string;
    full_name?: string;
    nik?: string;
    device_id?: string;
    device_model?: string;
    pin_hash?: string;
}

export interface UserUpdate {
    full_name?: string;
    nik?: string;
    kyc_status?: 'pending' | 'verified' | 'rejected';
    kyc_verified_at?: string;
    device_id?: string;
    device_model?: string;
    pin_hash?: string;
    biometric_enabled?: boolean;
    balance?: number;
    daily_limit?: number;
    avatar_url?: string;
}

// ─── Merchants UMKM ────────────────────────────────────────────
export interface MerchantRow {
    id: string;
    user_id: string | null;
    business_name: string;
    category: 'batik' | 'kuliner' | 'kerajinan' | 'jasa' | 'lainnya';
    description: string | null;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    phone: string | null;
    rating: number;
    total_reviews: number;
    total_transactions: number;
    is_verified: boolean;
    ad_tier: 'free' | 'basic' | 'premium';
    ad_expires_at: string | null;
    photo_urls: string[] | null;
    created_at: string;
}

export interface MerchantInsert {
    user_id?: string;
    business_name: string;
    category: 'batik' | 'kuliner' | 'kerajinan' | 'jasa' | 'lainnya';
    description?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    phone?: string;
}

export interface MerchantUpdate {
    business_name?: string;
    category?: 'batik' | 'kuliner' | 'kerajinan' | 'jasa' | 'lainnya';
    description?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    phone?: string;
    rating?: number;
    total_reviews?: number;
    total_transactions?: number;
    is_verified?: boolean;
    ad_tier?: 'free' | 'basic' | 'premium';
    ad_expires_at?: string;
    photo_urls?: string[];
}

// ─── Transactions ───────────────────────────────────────────────
export type TransactionType = 'topup' | 'transfer_bank' | 'transfer_user' | 'qris_pay' | 'ewallet_topup' | 'merchant_pay';
export type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed' | 'reversed';

export interface TransactionRow {
    id: string;
    sender_id: string | null;
    receiver_id: string | null;
    type: TransactionType;
    amount: number;
    fee: number;
    status: TransactionStatus;
    reference_id: string;
    snap_transaction_id: string | null;
    description: string | null;
    metadata: Record<string, unknown>;
    device_id: string | null;
    ip_address: string | null;
    created_at: string;
    completed_at: string | null;
}

export interface TransactionInsert {
    sender_id?: string;
    receiver_id?: string;
    type: TransactionType;
    amount: number;
    fee?: number;
    reference_id: string;
    snap_transaction_id?: string;
    description?: string;
    metadata?: Record<string, unknown>;
    device_id?: string;
}

// ─── Mosques ────────────────────────────────────────────────────
export interface MosqueRow {
    id: string;
    name: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    imam_name: string | null;
    khatib_jumat: string | null;
    phone: string | null;
    photo_url: string | null;
    created_at: string;
}

export interface MosqueInsert {
    name: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    imam_name?: string;
    khatib_jumat?: string;
    phone?: string;
    photo_url?: string;
}

export interface MosqueUpdate {
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    imam_name?: string;
    khatib_jumat?: string;
    phone?: string;
    photo_url?: string;
}

// ─── Mosque Schedules ───────────────────────────────────────────
export interface MosqueScheduleRow {
    id: string;
    mosque_id: string;
    prayer_name: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'jumat';
    schedule_date: string;
    time: string;
    khatib_name: string | null;
    kajian_topic: string | null;
    created_at: string;
}

export interface MosqueScheduleInsert {
    mosque_id: string;
    prayer_name: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'jumat';
    schedule_date: string;
    time: string;
    khatib_name?: string;
    kajian_topic?: string;
}

export interface MosqueScheduleUpdate {
    prayer_name?: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'jumat';
    schedule_date?: string;
    time?: string;
    khatib_name?: string;
    kajian_topic?: string;
}

// ─── Reviews ────────────────────────────────────────────────────
export interface ReviewRow {
    id: string;
    merchant_id: string;
    user_id: string;
    transaction_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
}

export interface ReviewInsert {
    merchant_id: string;
    user_id: string;
    transaction_id: string;
    rating: number;
    comment?: string;
}

// ─── City Events ────────────────────────────────────────────────
export interface CityEventRow {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    event_date: string | null;
    event_end: string | null;
    category: string | null;
    image_url: string | null;
    organizer: string | null;
    created_at: string;
}

export interface CityEventInsert {
    title: string;
    description?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    event_date?: string;
    event_end?: string;
    category?: string;
    image_url?: string;
    organizer?: string;
}

export interface CityEventUpdate {
    title?: string;
    description?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    event_date?: string;
    event_end?: string;
    category?: string;
    image_url?: string;
    organizer?: string;
}
