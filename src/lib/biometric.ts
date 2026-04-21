/**
 * PekalonganPay Biometric Authentication Module
 * 
 * Wraps expo-local-authentication for transaction authorization.
 * Requires biometric auth for transactions above BIOMETRIC_THRESHOLD.
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { BIOMETRIC_THRESHOLD } from './constants';

export type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

export interface BiometricResult {
    success: boolean;
    error?: string;
    biometricType?: BiometricType;
}

/**
 * Check if biometric hardware is available on the device
 */
export async function isBiometricAvailable(): Promise<boolean> {
    try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        return compatible && enrolled;
    } catch {
        return false;
    }
}

/**
 * Get available biometric types on the device
 */
export async function getBiometricTypes(): Promise<BiometricType[]> {
    try {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        return types.map((type) => {
            switch (type) {
                case LocalAuthentication.AuthenticationType.FINGERPRINT:
                    return 'fingerprint';
                case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
                    return 'facial';
                case LocalAuthentication.AuthenticationType.IRIS:
                    return 'iris';
                default:
                    return 'none';
            }
        });
    } catch {
        return ['none'];
    }
}

/**
 * Authenticate with biometrics
 * @param reason - The reason shown to the user for the biometric prompt
 */
export async function authenticateWithBiometric(
    reason: string = 'Verifikasi identitas Anda untuk melanjutkan transaksi'
): Promise<BiometricResult> {
    try {
        const available = await isBiometricAvailable();
        if (!available) {
            return {
                success: false,
                error: 'Biometrik tidak tersedia pada perangkat ini',
            };
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: reason,
            cancelLabel: 'Batalkan',
            fallbackLabel: 'Gunakan PIN',
            disableDeviceFallback: false,
        });

        if (result.success) {
            return { success: true };
        }

        return {
            success: false,
            error: result.error === 'user_cancel'
                ? 'Verifikasi dibatalkan'
                : 'Verifikasi biometrik gagal',
        };
    } catch (error) {
        return {
            success: false,
            error: 'Terjadi kesalahan saat verifikasi biometrik',
        };
    }
}

/**
 * Check if a transaction amount requires biometric authentication
 */
export function requiresBiometric(amount: number): boolean {
    return amount >= BIOMETRIC_THRESHOLD;
}

/**
 * Authorize a transaction - requires biometric for high-value transactions
 * @param amount - Transaction amount in IDR
 * @returns BiometricResult
 */
export async function authorizeTransaction(amount: number): Promise<BiometricResult> {
    if (!requiresBiometric(amount)) {
        return { success: true };
    }

    const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

    return authenticateWithBiometric(
        `Verifikasi untuk transaksi ${formattedAmount}`
    );
}

export default {
    isBiometricAvailable,
    getBiometricTypes,
    authenticateWithBiometric,
    requiresBiometric,
    authorizeTransaction,
};
