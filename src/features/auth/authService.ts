/**
 * PekalonganPay Auth Service
 * Handles registration, OTP, KYC, and login flows
 */

import { OTP_RATE_LIMIT, OTP_RATE_WINDOW_MS } from '@/lib/constants';
import { getDeviceInfo } from '@/lib/device';
import { hashPin, verifyPin } from '@/lib/encryption';
import { supabase } from '@/lib/supabase';
import type { UserRow } from '@/types/database';

// In-memory OTP rate limiter (per session)
const otpAttempts: Map<string, { count: number; firstAttempt: number }> = new Map();

export interface RegisterParams {
    phone: string;
    fullName: string;
    pin: string;
}

export interface OTPVerifyParams {
    phone: string;
    otp: string;
}

export interface KYCVerifyParams {
    userId: string;
    nik: string;
    fullName: string;
}

/**
 * Check OTP rate limiting
 */
function checkOTPRateLimit(phone: string): boolean {
    const now = Date.now();
    const record = otpAttempts.get(phone);

    if (!record || now - record.firstAttempt > OTP_RATE_WINDOW_MS) {
        otpAttempts.set(phone, { count: 1, firstAttempt: now });
        return true;
    }

    if (record.count >= OTP_RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

/**
 * Send OTP to phone number (simulated)
 * In production: integrate with WhatsApp Business API or SMS gateway
 */
export async function sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    if (!checkOTPRateLimit(phone)) {
        return {
            success: false,
            message: 'Terlalu banyak permintaan OTP. Silakan coba lagi dalam 10 menit.',
        };
    }

    // Simulated OTP generation (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Supabase (with expiry)
    // In production, this should be handled server-side
    console.log(`[DEV] OTP for ${phone}: ${otp}`);

    return {
        success: true,
        message: 'Kode OTP telah dikirim via WhatsApp',
    };
}

/**
 * Verify OTP
 */
export async function verifyOTP(params: OTPVerifyParams): Promise<{ success: boolean; message: string }> {
    // In production: verify against stored OTP with expiry check
    // Simulated: accept any 6-digit OTP for development
    if (params.otp.length === 6 && /^\d+$/.test(params.otp)) {
        return { success: true, message: 'OTP terverifikasi' };
    }

    return { success: false, message: 'Kode OTP tidak valid' };
}

/**
 * Register new user
 */
export async function registerUser(params: RegisterParams): Promise<{
    success: boolean;
    user?: UserRow;
    message: string
}> {
    try {
        const deviceInfo = await getDeviceInfo();
        const { hash: pinHash, salt: pinSalt } = await hashPin(params.pin);

        // Sign up with Supabase Auth (phone-based)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            phone: params.phone,
            password: pinHash, // Use hashed PIN as password
        });

        if (authError) {
            return { success: false, message: authError.message };
        }

        // Create user profile in public.users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                phone: params.phone,
                full_name: params.fullName,
                pin_hash: `${pinHash}:${pinSalt}`,
                device_id: deviceInfo.deviceId,
                device_model: deviceInfo.deviceModel,
            })
            .select()
            .single();

        if (userError) {
            return { success: false, message: userError.message };
        }

        return {
            success: true,
            user: userData as UserRow,
            message: 'Registrasi berhasil! Silakan verifikasi KYC Anda.',
        };
    } catch (error) {
        return {
            success: false,
            message: `Registrasi gagal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}

/**
 * Login with phone and PIN
 */
export async function loginWithPin(phone: string, pin: string): Promise<{
    success: boolean;
    user?: UserRow;
    message: string;
}> {
    try {
        // Get user from database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .single();

        if (error || !user) {
            return { success: false, message: 'Nomor HP tidak terdaftar' };
        }

        // Verify device binding
        const deviceInfo = await getDeviceInfo();
        if (user.device_id && user.device_id !== deviceInfo.deviceId) {
            return {
                success: false,
                message: 'Perangkat tidak dikenali. Silakan verifikasi identitas Anda.'
            };
        }

        // Verify PIN
        if (user.pin_hash) {
            const [storedHash, salt] = user.pin_hash.split(':');
            const pinValid = await verifyPin(pin, storedHash, salt);
            if (!pinValid) {
                return { success: false, message: 'PIN salah' };
            }
        }

        return {
            success: true,
            user: user as UserRow,
            message: 'Login berhasil'
        };
    } catch (error) {
        return {
            success: false,
            message: `Login gagal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}

/**
 * Validate NIK with Dukcapil API (Simulated)
 * In production: integrate with real Dukcapil SIAK API
 */
export async function validateKYC(params: KYCVerifyParams): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        // Simulate Dukcapil API validation delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Basic NIK validation (16 digits)
        if (params.nik.length !== 16 || !/^\d+$/.test(params.nik)) {
            return { success: false, message: 'Format NIK tidak valid (harus 16 digit)' };
        }

        // Simulate verification (in production, call Dukcapil API)
        // Province code check (first 2 digits)
        const provinceCode = parseInt(params.nik.substring(0, 2));
        if (provinceCode < 11 || provinceCode > 92) {
            return { success: false, message: 'Kode provinsi NIK tidak valid' };
        }

        // Update user KYC status
        const { error } = await supabase
            .from('users')
            .update({
                nik: params.nik,
                kyc_status: 'verified',
                kyc_verified_at: new Date().toISOString(),
            })
            .eq('id', params.userId);

        if (error) {
            return { success: false, message: error.message };
        }

        return {
            success: true,
            message: 'KYC berhasil diverifikasi. Akun Anda sekarang terverifikasi penuh.',
        };
    } catch (error) {
        return {
            success: false,
            message: `Verifikasi KYC gagal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
    await supabase.auth.signOut();
}

export default {
    sendOTP,
    verifyOTP,
    registerUser,
    loginWithPin,
    validateKYC,
    logoutUser,
};
