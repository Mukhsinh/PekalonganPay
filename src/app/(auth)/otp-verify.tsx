import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OTPVerifyScreen() {
    const router = useRouter();
    const { phone, next } = useLocalSearchParams<{ phone: string; next?: string }>();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputs = useRef<TextInput[]>([]);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Format phone for display (e.g., +62 812 •••• ••90)
    const formatDisplayPhone = (num: string | null) => {
        if (!num) return '+62 812 •••• ••90';

        // Remove spaces and + if any, then reformat
        const clean = num.replace(/\D/g, '');
        if (clean.startsWith('62')) {
            return `+62 ${clean.slice(2, 5)} •••• ••${clean.slice(-2)}`;
        }
        return num;
    };

    const displayPhone = formatDisplayPhone(phone);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        // Auto verify when all digits entered
        if (newOtp.every((d) => d !== '')) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (code: string) => {
        if (!phone) {
            Alert.alert('Error', 'Nomor HP tidak ditemukan');
            return;
        }

        setIsVerifying(true);
        try {
            // DEVELOPMENT BYPASS: Ketik 000000 untuk melewati verifikasi saat testing
            if (code === '000000') {
                console.log('Development Bypass Triggered for:', phone);
                Alert.alert('Developer Mode', 'Verifikasi berhasil dilewati.');
                router.replace({
                    pathname: '/(auth)/kyc-verify',
                    params: { phone, next: next || '/(tabs)/home' }
                });
                return;
            }

            const { error, data } = await supabase.auth.verifyOtp({
                phone,
                token: code,
                type: 'sms', // Note: Supabase uses 'sms' type for phone OTP even if sent via WhatsApp
            });

            if (error) throw error;

            // Success! Navigate to next screen
            const target = (next as any) || '/(auth)/kyc-verify';
            router.replace(target);
        } catch (error: any) {
            Alert.alert('Verifikasi Gagal', error.message || 'Kode OTP tidak valid');
            // Reset OTP inputs on error
            setOtp(['', '', '', '', '', '']);
            inputs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0 || !phone) return;

        setIsVerifying(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone,
                options: { channel: 'whatsapp' }
            });

            if (error) throw error;

            setTimer(60);
            Alert.alert('OTP Dikirim', 'Kode OTP baru telah dikirim via WhatsApp');
        } catch (error: any) {
            Alert.alert('Gagal', error.message || 'Gagal mengirim ulang OTP');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <LinearGradient colors={['#0A1628', '#0D2847']} style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
                {/* Back */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ position: 'absolute', top: 60, left: 28 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                {/* Icon */}
                <Animated.View
                    style={{
                        alignSelf: 'center',
                        transform: [{ scale: pulseAnim }],
                        marginBottom: 32,
                    }}
                >
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: 'rgba(0, 217, 192, 0.12)',
                            borderWidth: 1.5,
                            borderColor: '#00D9C0',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name="chatbubble-ellipses" size={36} color="#00D9C0" />
                    </View>
                </Animated.View>

                {/* Title */}
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFF', textAlign: 'center' }}>
                    Verifikasi OTP
                </Text>
                <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                    Masukkan 6 digit kode yang dikirim ke{'\n'}
                    <Text style={{ color: '#00D9C0', fontWeight: '600' }}>WhatsApp {displayPhone}</Text>
                </Text>

                {/* OTP Inputs */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 10,
                        marginTop: 40,
                        marginBottom: 32,
                    }}
                >
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { if (ref) inputs.current[index] = ref; }}
                            style={{
                                width: 48,
                                height: 56,
                                borderRadius: 12,
                                backgroundColor: digit ? 'rgba(0, 217, 192, 0.12)' : 'rgba(255,255,255,0.06)',
                                borderWidth: 1.5,
                                borderColor: digit ? '#00D9C0' : 'rgba(255,255,255,0.1)',
                                color: '#FFF',
                                fontSize: 24,
                                fontWeight: '700',
                                textAlign: 'center',
                            }}
                            maxLength={1}
                            keyboardType="number-pad"
                            value={digit}
                            onChangeText={(v) => handleOtpChange(v, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                        />
                    ))}
                </View>

                {/* Timer & Resend */}
                <TouchableOpacity
                    onPress={handleResend}
                    disabled={timer > 0}
                    style={{ alignSelf: 'center', marginBottom: 32 }}
                >
                    <Text style={{ fontSize: 14, color: timer > 0 ? '#64748B' : '#D4A843', fontWeight: '500' }}>
                        {timer > 0 ? `Kirim ulang dalam ${timer} detik` : 'Kirim Ulang OTP'}
                    </Text>
                </TouchableOpacity>

                {/* Loading indicator */}
                {isVerifying && (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: '#00D9C0', fontSize: 14, fontWeight: '600' }}>
                            Memverifikasi...
                        </Text>
                    </View>
                )}

                {/* Security Note */}
                <View style={{ alignItems: 'center', marginTop: 48 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="shield-checkmark-outline" size={14} color="#2ED573" />
                        <Text style={{ fontSize: 11, color: '#4A5568', marginLeft: 6 }}>
                            OTP terenkripsi end-to-end • Rate limited
                        </Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
}
