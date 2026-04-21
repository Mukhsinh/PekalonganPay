/**
 * PekalonganPay Device Binding Module
 * 
 * Generates and verifies device IDs to prevent account takeover.
 * Binds user account to a specific device during registration.
 */

import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';

const DEVICE_ID_KEY = 'pkp_device_id';

export interface DeviceInfo {
    deviceId: string;
    deviceName: string;
    deviceModel: string;
    osName: string;
    osVersion: string;
    brand: string;
}

/**
 * Generate a unique device fingerprint
 */
async function generateDeviceFingerprint(): Promise<string> {
    const components = [
        Device.brand || 'unknown',
        Device.modelName || 'unknown',
        Device.osName || 'unknown',
        Device.osVersion || 'unknown',
        Device.deviceName || 'unknown',
        Date.now().toString(),
    ];

    const randomBytes = await Crypto.getRandomBytes(16);
    const randomHex = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    const fingerprint = components.join('|') + '|' + randomHex;

    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        fingerprint
    );
}

/**
 * Get or create the device ID
 * The device ID is generated once and stored securely
 */
export async function getDeviceId(): Promise<string> {
    let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

    if (!deviceId) {
        deviceId = await generateDeviceFingerprint();
        await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
}

/**
 * Get comprehensive device information
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
    const deviceId = await getDeviceId();

    return {
        deviceId,
        deviceName: Device.deviceName || 'Unknown Device',
        deviceModel: Device.modelName || 'Unknown Model',
        osName: Device.osName || 'Unknown OS',
        osVersion: Device.osVersion || '0',
        brand: Device.brand || 'Unknown Brand',
    };
}

/**
 * Verify that the current device matches the registered device
 * @param registeredDeviceId - The device ID stored on the server
 */
export async function verifyDevice(registeredDeviceId: string): Promise<boolean> {
    const currentDeviceId = await getDeviceId();
    return currentDeviceId === registeredDeviceId;
}

/**
 * Reset device binding (for device migration)
 * This should only be called after proper identity verification
 */
export async function resetDeviceBinding(): Promise<string> {
    await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
    return await getDeviceId(); // Generate new ID
}

export default {
    getDeviceId,
    getDeviceInfo,
    verifyDevice,
    resetDeviceBinding,
};
