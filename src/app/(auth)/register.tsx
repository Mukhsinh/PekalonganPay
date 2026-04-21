import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Info, 2: PIN
    const buttonScale = useRef(new Animated.Value(1)).current;

    const handleNext = () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Masukkan nama lengkap');
            return;
        }
        if (!phone || phone.length < 10) {
            Alert.alert('Error', 'Masukkan nomor HP yang valid');
            return;
        }
        setStep(2);
    };

    const handleRegister = async () => {
        if (pin.length !== 6) {
            Alert.alert('Error', 'PIN harus 6 digit');
            return;
        }
        if (pin !== confirmPin) {
            Alert.alert('Error', 'Konfirmasi PIN tidak cocok');
            return;
        }

        setIsLoading(true);
        try {
            // Format phone number to E.164 strictly for Indonesia (+62)
            let cleanPhone = phone.replace(/\D/g, '');

            if (cleanPhone.startsWith('62')) {
                cleanPhone = cleanPhone; // Already has 62
            } else if (cleanPhone.startsWith('0')) {
                cleanPhone = '62' + cleanPhone.slice(1);
            } else if (cleanPhone.startsWith('8')) {
                cleanPhone = '62' + cleanPhone;
            }

            const formattedPhone = `+${cleanPhone}`;
            console.log('Registering with:', { original: phone, clean: cleanPhone, formatted: formattedPhone });

            const { data, error } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
                options: {
                    channel: 'whatsapp',
                }
            });

            if (error) {
                console.error('Supabase Auth OTP Error:', error);
                throw error;
            }

            console.log('Supabase Auth OTP Success:', data);

            router.push({
                pathname: '/(auth)/otp-verify',
                params: { phone: formattedPhone }
            });
        } catch (error: any) {
            console.error('Registration Handle Error:', error);
            Alert.alert(
                'Gagal Mengirim OTP',
                error.message || 'Terjadi kesalahan saat menghubungi layanan WhatsApp. Pastikan nomor Anda terdaftar di WhatsApp.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LinearGradient colors={['#0A1628', '#0D2847']} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 28,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => (step === 2 ? setStep(1) : router.back())}
                        style={{
                            position: 'absolute',
                            top: 60,
                            left: 0,
                            padding: 8,
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF' }}>
                            Buat Akun Baru
                        </Text>
                        <Text style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>
                            {step === 1 ? 'Langkah 1 dari 3 — Informasi Dasar' : 'Langkah 2 dari 3 — Buat PIN'}
                        </Text>

                        {/* Step Indicator */}
                        <View style={{ flexDirection: 'row', marginTop: 20, gap: 8 }}>
                            {[1, 2, 3].map((s) => (
                                <View
                                    key={s}
                                    style={{
                                        width: s <= step ? 32 : 12,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: s <= step ? '#00D9C0' : 'rgba(255,255,255,0.15)',
                                    }}
                                />
                            ))}
                        </View>
                    </View>

                    {step === 1 ? (
                        <>
                            {/* Full Name */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '600' }}>
                                    Nama Lengkap (sesuai KTP)
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: 'rgba(0, 217, 192, 0.2)',
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    <Ionicons name="person-outline" size={20} color="#64748B" style={{ marginRight: 12 }} />
                                    <TextInput
                                        style={{ flex: 1, height: 52, color: '#FFFFFF', fontSize: 16 }}
                                        placeholder="Masukkan nama lengkap"
                                        placeholderTextColor="#4A5568"
                                        value={fullName}
                                        onChangeText={setFullName}
                                    />
                                </View>
                            </View>

                            {/* Phone */}
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '600' }}>
                                    Nomor HP (sebagai ID akun)
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: 'rgba(0, 217, 192, 0.2)',
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    <Text style={{ color: '#00D9C0', fontSize: 16, fontWeight: '700', marginRight: 8 }}>
                                        +62
                                    </Text>
                                    <View style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 12 }} />
                                    <TextInput
                                        style={{ flex: 1, height: 52, color: '#FFFFFF', fontSize: 16 }}
                                        placeholder="812 3456 7890"
                                        placeholderTextColor="#4A5568"
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                        maxLength={13}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
                                <LinearGradient
                                    colors={['#00D9C0', '#0D7377']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        height: 54,
                                        borderRadius: 14,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
                                        LANJUTKAN
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* PIN */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '600' }}>
                                    Buat PIN (6 digit)
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: 'rgba(0, 217, 192, 0.2)',
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={{ marginRight: 12 }} />
                                    <TextInput
                                        style={{ flex: 1, height: 52, color: '#FFFFFF', fontSize: 20, letterSpacing: 8 }}
                                        placeholder="• • • • • •"
                                        placeholderTextColor="#4A5568"
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        value={pin}
                                        onChangeText={setPin}
                                        maxLength={6}
                                    />
                                </View>
                            </View>

                            {/* Confirm PIN */}
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8, fontWeight: '600' }}>
                                    Konfirmasi PIN
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: pin && confirmPin && pin === confirmPin ? 'rgba(46, 213, 115, 0.4)' : 'rgba(0, 217, 192, 0.2)',
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    <Ionicons
                                        name={pin && confirmPin && pin === confirmPin ? 'checkmark-circle' : 'lock-closed-outline'}
                                        size={20}
                                        color={pin && confirmPin && pin === confirmPin ? '#2ED573' : '#64748B'}
                                        style={{ marginRight: 12 }}
                                    />
                                    <TextInput
                                        style={{ flex: 1, height: 52, color: '#FFFFFF', fontSize: 20, letterSpacing: 8 }}
                                        placeholder="• • • • • •"
                                        placeholderTextColor="#4A5568"
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        value={confirmPin}
                                        onChangeText={setConfirmPin}
                                        maxLength={6}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity onPress={handleRegister} disabled={isLoading} activeOpacity={0.9}>
                                <LinearGradient
                                    colors={['#00D9C0', '#0D7377']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        height: 54,
                                        borderRadius: 14,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 1 }}>
                                        {isLoading ? 'MEMPROSES...' : 'DAFTAR'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Login Link */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        style={{ marginTop: 24, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#94A3B8', fontSize: 14 }}>
                            Sudah punya akun?{' '}
                            <Text style={{ color: '#D4A843', fontWeight: '700' }}>Masuk</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}
