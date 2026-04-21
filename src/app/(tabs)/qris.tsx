import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COLORS = {
    primary: '#DC2626',
    secondary: '#FACC15',
    accent: '#2563EB',
    background: '#F8FAFC',
    white: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    success: '#10B981',
};

export default function QRISScreen() {
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<'scan' | 'show'>('scan');
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const scanLineY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation for QR frame
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
            ])
        ).start();

        // Scan line animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineY, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(scanLineY, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const scanLineTranslate = scanLineY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 250],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Text style={styles.headerTitle}>QRIS Payment</Text>
                <Text style={styles.headerSubtitle}>
                    Quick Response Code Indonesia Standard
                </Text>

                {/* Mode Toggle */}
                <View style={styles.toggleContainer}>
                    {['scan', 'show'].map((m) => (
                        <TouchableOpacity
                            key={m}
                            onPress={() => setMode(m as 'scan' | 'show')}
                            style={[
                                styles.toggleItem,
                                mode === m && styles.toggleItemActive
                            ]}
                        >
                            <Ionicons
                                name={m === 'scan' ? 'camera' : 'qr-code'}
                                size={18}
                                color={mode === m ? COLORS.white : COLORS.textMuted}
                            />
                            <Text style={[
                                styles.toggleText,
                                mode === m && styles.toggleTextActive
                            ]}>
                                {m === 'scan' ? 'Scan QR' : 'QR Saya'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* QR Scanner Area */}
            <View style={styles.scannerArea}>
                {mode === 'scan' ? (
                    <View style={styles.scannerContainer}>
                        <Animated.View
                            style={[
                                styles.scanFrame,
                                { transform: [{ scale: pulseAnim }] }
                            ]}
                        >
                            {/* Corner decorations */}
                            <View style={[styles.corner, styles.cornerTopLeft]} />
                            <View style={[styles.corner, styles.cornerTopRight]} />
                            <View style={[styles.corner, styles.cornerBottomLeft]} />
                            <View style={[styles.corner, styles.cornerBottomRight]} />

                            {/* Scan line */}
                            <Animated.View
                                style={[
                                    styles.scanLine,
                                    { transform: [{ translateY: scanLineTranslate }] }
                                ]}
                            />

                            <Ionicons name="qr-code-outline" size={100} color={COLORS.accent + '15'} />
                        </Animated.View>

                        <View style={styles.scannerOverlay}>
                            <View style={styles.overlayTextContainer}>
                                <Text style={styles.overlayText}>
                                    Arahkan kamera ke kode QRIS merchant
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.myQrContainer}>
                        <View style={styles.qrCard}>
                            <View style={styles.qrHeader}>
                                <Text style={styles.qrBrand}>PekalonganPay</Text>
                                <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
                            </View>
                            <View style={styles.qrWrapper}>
                                <Ionicons name="qr-code" size={200} color={COLORS.text} />
                            </View>
                            <Text style={styles.qrUser}>Mukhsin Hadi</Text>
                            <Text style={styles.qrInstruction}>Tunjukkan QR ini ke kasir</Text>
                        </View>
                    </View>
                )}

                {/* Flash & Gallery buttons */}
                {mode === 'scan' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="flash" size={22} color={COLORS.secondary} />
                            <Text style={styles.actionButtonText}>Senter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="image" size={22} color={COLORS.accent} />
                            <Text style={styles.actionButtonText}>Galeri</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Bottom Info */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 100 }]}>
                <View style={styles.securityBadge}>
                    <Ionicons name="lock-closed" size={12} color={COLORS.success} />
                    <Text style={styles.securityText}>Transaksi Terenkripsi & Aman</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: COLORS.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 6,
        fontWeight: '500',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        borderRadius: 18,
        marginTop: 25,
        padding: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    toggleItem: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    toggleItemActive: {
        backgroundColor: COLORS.primary,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textMuted,
    },
    toggleTextActive: {
        color: COLORS.white,
    },
    scannerArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
    },
    scanFrame: {
        width: 280,
        height: 280,
        backgroundColor: COLORS.white,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: COLORS.primary,
        borderWidth: 4,
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderTopLeftRadius: 30,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderTopRightRadius: 30,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomLeftRadius: 30,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderBottomRightRadius: 30,
    },
    scanLine: {
        position: 'absolute',
        top: 15,
        left: 15,
        right: 15,
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        zIndex: 10,
    },
    scannerOverlay: {
        marginTop: 40,
        paddingHorizontal: 40,
    },
    overlayTextContainer: {
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    overlayText: {
        fontSize: 14,
        color: COLORS.text,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 20,
    },
    myQrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrCard: {
        backgroundColor: COLORS.white,
        borderRadius: 35,
        padding: 30,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 30,
        width: width * 0.85,
    },
    qrHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 25,
    },
    qrBrand: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.primary,
    },
    qrWrapper: {
        padding: 10,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
    },
    qrUser: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text,
        marginTop: 25,
    },
    qrInstruction: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginTop: 6,
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 40,
    },
    actionButton: {
        alignItems: 'center',
        gap: 8,
    },
    actionButtonIcon: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.text,
    },
    footer: {
        alignItems: 'center',
    },
    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    securityText: {
        fontSize: 11,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
});

