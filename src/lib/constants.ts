// PekalonganPay Constants
export const APP_NAME = 'PekalonganPay';
export const APP_VERSION = '1.0.0';

// Supabase Configuration
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cgxqssenxfxozetuctre.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneHFzc2VueGZ4b3pldHVjdHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDA3OTIsImV4cCI6MjA5MjMxNjc5Mn0.f4-gM9dcroK4DAKHm10bioGkJ1pxRmiteGTSbDr_5jA';

// Security Constants
export const BIOMETRIC_THRESHOLD = 500000; // Rp 500.000 - require biometric above this
export const OTP_RATE_LIMIT = 3; // Max OTP requests per window
export const OTP_RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
export const PIN_LENGTH = 6;
export const MAX_PIN_ATTEMPTS = 5;

// Transaction Limits
export const DAILY_TRANSFER_LIMIT = 5000000; // Rp 5.000.000
export const MONTHLY_TRANSFER_LIMIT = 25000000; // Rp 25.000.000
export const MIN_TOPUP_AMOUNT = 10000; // Rp 10.000
export const MAX_TOPUP_AMOUNT = 10000000; // Rp 10.000.000

// SNAP API Configuration (Bank Indonesia Standard)
export const SNAP_BASE_URL = process.env.EXPO_PUBLIC_SNAP_BASE_URL || 'https://api.snap.example.com';
export const SNAP_CLIENT_ID = process.env.EXPO_PUBLIC_SNAP_CLIENT_ID || '';
export const SNAP_PARTNER_ID = process.env.EXPO_PUBLIC_SNAP_PARTNER_ID || '';

// Design System Colors
export const Colors = {
    primary: {
        teal: '#0D7377',
        tealLight: '#00D9C0',
        gold: '#D4A843',
        goldLight: '#FFD700',
    },
    surface: {
        dark: '#0A1628',
        card: '#111D35',
        elevated: '#162340',
    },
    text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8',
        muted: '#64748B',
        gold: '#D4A843',
    },
    accent: {
        red: '#FF4757',
        green: '#2ED573',
        blue: '#1E90FF',
    },
    batik: {
        brown: '#8B4513',
        cream: '#FFF8E7',
        indigo: '#2E0854',
        maroon: '#800020',
    },
    gradient: {
        tealStart: '#0D7377',
        tealEnd: '#00D9C0',
        goldStart: '#D4A843',
        goldEnd: '#FFD700',
        darkStart: '#0A1628',
        darkEnd: '#162340',
    },
};

// Quick Action Items
export const QUICK_ACTIONS = [
    { id: 'transfer', icon: 'send', label: 'Transfer', color: '#00D9C0' },
    { id: 'qris', icon: 'qr-code', label: 'QRIS', color: '#FFD700' },
    { id: 'topup', icon: 'wallet', label: 'Top Up', color: '#2ED573' },
    { id: 'pulsa', icon: 'phone-portrait', label: 'Pulsa', color: '#FF6B81' },
    { id: 'pln', icon: 'flash', label: 'PLN', color: '#FFA502' },
    { id: 'pdam', icon: 'water', label: 'PDAM', color: '#1E90FF' },
    { id: 'ewallet', icon: 'card', label: 'E-Wallet', color: '#A55EEA' },
    { id: 'more', icon: 'grid', label: 'Lainnya', color: '#94A3B8' },
] as const;

// Bank List for Transfer
export const BANKS = [
    { code: 'BRI', name: 'Bank BRI', icon: '🏦' },
    { code: 'BCA', name: 'Bank BCA', icon: '🏦' },
    { code: 'MANDIRI', name: 'Bank Mandiri', icon: '🏦' },
    { code: 'BNI', name: 'Bank BNI', icon: '🏦' },
    { code: 'BSI', name: 'Bank Syariah Indonesia', icon: '🕌' },
    { code: 'CIMB', name: 'CIMB Niaga', icon: '🏦' },
    { code: 'DANAMON', name: 'Bank Danamon', icon: '🏦' },
    { code: 'PERMATA', name: 'Bank Permata', icon: '🏦' },
] as const;

// E-Wallet Providers
export const EWALLETS = [
    { code: 'OVO', name: 'OVO', color: '#4C2D73' },
    { code: 'GOPAY', name: 'GoPay', color: '#00AED6' },
    { code: 'SHOPEEPAY', name: 'ShopeePay', color: '#EE4D2D' },
    { code: 'LINKAJA', name: 'LinkAja', color: '#E31E25' },
    { code: 'DANA', name: 'DANA', color: '#108EE9' },
] as const;

// UMKM Categories
export const UMKM_CATEGORIES = [
    { id: 'batik', label: 'Batik', icon: '🎨', color: '#8B4513' },
    { id: 'kuliner', label: 'Kuliner', icon: '🍜', color: '#FF6B81' },
    { id: 'kerajinan', label: 'Kerajinan', icon: '✨', color: '#D4A843' },
    { id: 'jasa', label: 'Jasa', icon: '🔧', color: '#1E90FF' },
    { id: 'lainnya', label: 'Lainnya', icon: '📦', color: '#94A3B8' },
] as const;

// Prayer Names
export const PRAYER_NAMES = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'] as const;
